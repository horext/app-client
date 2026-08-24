import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import {
  InitialSyncCoordinator,
  type InitialSyncDependencies,
} from '../initial-sync-coordinator'
import { UnsupportedResourceOperationError } from '../../../domain/errors/unsupported-resource-operation.error'
import {
  activity,
  profile,
} from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import {
  createOperation,
  deleteOperation,
  updateOperation,
} from '../aggregate-sync.use-case'
import {
  ActivityPersistenceMapper,
  ProfilePersistenceMapper,
} from '~~/modules/schedules-storage/runtime/app/mappers'

function dependencies() {
  const order: string[] = []
  const singleton = (
    resource: SyncResource,
  ): InitialSyncDependencies['profile'] => ({
    localSnapshot: vi.fn(async () => {
      order.push(resource)
      return []
    }),
    cloudSnapshot: vi.fn().mockResolvedValue([]),
    replaceLocal: vi.fn().mockResolvedValue(undefined),
    create: vi.fn(),
    update: vi.fn(),
    applyUpsert: vi.fn().mockResolvedValue(undefined),
    applyDelete: vi.fn(async () => {
      throw new UnsupportedResourceOperationError(resource, 'delete')
    }),
    cloudDeletionOperations: vi.fn().mockResolvedValue([]),
  })
  const collection = (resource: SyncResource) => {
    const useCase = {
      ...singleton(resource),
      delete: vi.fn(),
      applyDelete: vi.fn().mockResolvedValue(undefined),
    }
    useCase.cloudDeletionOperations = vi.fn(async () =>
      (await useCase.cloudSnapshot()).map((item) =>
        useCase.delete(item.id, item.revision),
      ),
    )
    return useCase
  }
  const result = {
    sync: {
      pending: vi.fn().mockResolvedValue([]),
      push: vi.fn(),
      enqueue: vi.fn(),
      recordConflict: vi.fn(),
    },
    anonymousData: {
      hasData: vi.fn().mockResolvedValue(false),
      stage: vi.fn().mockResolvedValue(undefined),
      cleanup: vi.fn().mockResolvedValue(undefined),
    },
    profile: singleton(SyncResource.PROFILE),
    preferences: singleton(SyncResource.PREFERENCES),
    academicConfig: singleton(SyncResource.ACADEMIC_CONFIG),
    activities: collection(SyncResource.ACTIVITIES),
    subjects: collection(SyncResource.SUBJECTS),
    schedules: collection(SyncResource.SCHEDULES),
    generations: collection(SyncResource.GENERATIONS),
    favorites: collection(SyncResource.FAVORITES),
  } satisfies InitialSyncDependencies
  return { result, order }
}

describe('InitialSyncCoordinator', () => {
  it('Given all synchronization resources, when initialization runs, then resources synchronize in deterministic order', async () => {
    const { result, order } = dependencies()
    const coordinator = new InitialSyncCoordinator(result)

    await coordinator.hasLocalData('user-1')

    expect(order).toEqual(Object.values(SyncResource))
  })

  it('Given a singleton remote deletion, when initialization applies it, then the coordinator rejects the unsupported capability', async () => {
    const { result } = dependencies()
    const coordinator = new InitialSyncCoordinator(result)

    await expect(
      coordinator.apply('user-1', SyncResource.PROFILE, {
        id: 'profile-1',
        sequence: 1,
        operation: 'delete',
        revision: 1,
        changedAt: new Date().toISOString(),
        data: null,
      }),
    ).rejects.toBeInstanceOf(UnsupportedResourceOperationError)
  })

  it('Given staged anonymous data and a failing resource, when initialization runs, then staged data remains recoverable', async () => {
    const { result } = dependencies()
    vi.mocked(result.activities.cloudSnapshot).mockRejectedValue(
      new Error('offline'),
    )
    const coordinator = new InitialSyncCoordinator(result)

    await expect(coordinator.run('user-1', 'merge')).rejects.toThrow('offline')
    expect(result.anonymousData.stage).toHaveBeenCalledWith('user-1')
    expect(result.anonymousData.cleanup).not.toHaveBeenCalled()
  })

  it('Given cloud snapshots, when replace-local runs, then every local aggregate is replaced without staging anonymous data', async () => {
    const { result } = dependencies()
    const coordinator = new InitialSyncCoordinator(result)

    await coordinator.run('user-1', 'replace-local')

    expect(result.profile.replaceLocal).toHaveBeenCalledWith('user-1', [])
    expect(result.favorites.replaceLocal).toHaveBeenCalledWith('user-1', [])
    expect(result.anonymousData.stage).not.toHaveBeenCalled()
    expect(result.anonymousData.cleanup).toHaveBeenCalledOnce()
  })

  it('Given local and remote aggregates, when replace-cloud runs, then collections are deleted before local create and update commands are queued', async () => {
    const { result } = dependencies()
    const localProfile = ProfilePersistenceMapper.toRecord(profile())
    const remoteActivity = ActivityPersistenceMapper.toRecord(activity())
    vi.mocked(result.profile.localSnapshot).mockResolvedValue([
      { id: localProfile.id, data: localProfile },
      { id: makeUUID(), data: localProfile, revision: 2 },
    ])
    vi.mocked(result.profile.create).mockReturnValue(
      createOperation(SyncResource.PROFILE, {
        id: localProfile.id,
        data: localProfile,
      }),
    )
    vi.mocked(result.profile.update).mockReturnValue(
      updateOperation(SyncResource.PROFILE, {
        id: localProfile.id,
        data: localProfile,
      }),
    )
    vi.mocked(result.activities.cloudSnapshot).mockResolvedValue([
      { id: remoteActivity.id, data: remoteActivity, revision: 4 },
    ])
    vi.mocked(result.activities.delete).mockReturnValue(
      deleteOperation(SyncResource.ACTIVITIES, remoteActivity.id, 4),
    )
    const coordinator = new InitialSyncCoordinator(result)

    await coordinator.run('user-1', 'replace-cloud')

    expect(result.activities.delete).toHaveBeenCalledWith(remoteActivity.id, 4)
    expect(result.profile.create).toHaveBeenCalledOnce()
    expect(result.profile.update).toHaveBeenCalledOnce()
    expect(result.sync.enqueue).toHaveBeenCalledTimes(3)
  })

  it('Given local-only and divergent aggregates, when merge runs, then creates and actionable conflicts are recorded', async () => {
    const { result } = dependencies()
    const local = ActivityPersistenceMapper.toRecord(activity())
    const cloud = { ...local, title: 'Cloud title' }
    const localSnapshot = { id: local.id, data: local }
    vi.mocked(result.activities.localSnapshot).mockResolvedValue([
      localSnapshot,
    ])
    vi.mocked(result.activities.create).mockReturnValue(
      createOperation(SyncResource.ACTIVITIES, localSnapshot),
    )
    vi.mocked(result.activities.update).mockReturnValue(
      updateOperation(SyncResource.ACTIVITIES, localSnapshot),
    )
    const coordinator = new InitialSyncCoordinator(result)

    await coordinator.run('user-1', 'merge')
    expect(result.sync.enqueue).toHaveBeenCalledOnce()

    vi.mocked(result.sync.enqueue).mockClear()
    vi.mocked(result.activities.cloudSnapshot).mockResolvedValue([
      { id: cloud.id, data: cloud, revision: 5 },
    ])
    await coordinator.run('user-1', 'merge')
    expect(result.sync.recordConflict).toHaveBeenCalledWith(
      expect.objectContaining({ cloudRevision: 5 }),
    )
  })

  it('Given a divergent cloud snapshot without a revision, when merge runs, then an unusable conflict is rejected', async () => {
    const { result } = dependencies()
    const local = ActivityPersistenceMapper.toRecord(activity())
    const localSnapshot = { id: local.id, data: local }
    vi.mocked(result.activities.localSnapshot).mockResolvedValue([
      localSnapshot,
    ])
    vi.mocked(result.activities.cloudSnapshot).mockResolvedValue([
      { id: local.id, data: { ...local, title: 'Cloud' } },
    ])
    const coordinator = new InitialSyncCoordinator(result)
    await expect(coordinator.run('user-1', 'merge')).rejects.toThrow(
      'Cloud conflict record must include a revision',
    )
  })

  it('Given anonymous or aggregate data, when local state is inspected, then detection stops at the first source', async () => {
    const { result } = dependencies()
    vi.mocked(result.anonymousData.hasData).mockResolvedValue(true)
    const coordinator = new InitialSyncCoordinator(result)
    await expect(coordinator.hasLocalData('user-1')).resolves.toBe(true)
    expect(result.profile.localSnapshot).not.toHaveBeenCalled()

    vi.mocked(result.anonymousData.hasData).mockResolvedValue(false)
    vi.mocked(result.profile.localSnapshot).mockResolvedValue([
      { id: makeUUID(), data: ProfilePersistenceMapper.toRecord(profile()) },
    ])
    await expect(coordinator.hasLocalData('anonymous')).resolves.toBe(true)
  })

  it('Given cloud upserts and collection deletions, when records are applied, then revisioned data reaches the proper aggregate capability', async () => {
    const { result } = dependencies()
    const coordinator = new InitialSyncCoordinator(result)
    const data = ActivityPersistenceMapper.toRecord(activity())
    await coordinator.applyCloudRecord(
      'user-1',
      {
        id: data.id,
        resource: SyncResource.ACTIVITIES,
        data,
        revision: 3,
        deletedAt: null,
      },
      4,
    )
    await coordinator.applyCloudRecord(
      'user-1',
      {
        id: data.id,
        resource: SyncResource.ACTIVITIES,
        data: null,
        revision: 4,
        deletedAt: new Date().toISOString(),
      },
      4,
    )
    expect(result.activities.applyUpsert).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ revision: 4 }),
    )
    expect(result.activities.applyDelete).toHaveBeenCalledWith(
      'user-1',
      data.id,
    )
  })

  it('Given an upsert record without data, when it is applied, then the malformed cloud record is rejected', async () => {
    const { result } = dependencies()
    const coordinator = new InitialSyncCoordinator(result)
    await expect(
      coordinator.applyCloudRecord(
        'user-1',
        {
          id: makeUUID(),
          resource: SyncResource.ACTIVITIES,
          data: null,
          revision: 1,
          deletedAt: null,
        },
        1,
      ),
    ).rejects.toThrow('must include data')
  })
})
