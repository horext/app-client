import { describe, expect, it, vi } from 'vitest'
import { Activity } from '#shared/domain'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import {
  SyncingActivitiesRepository,
  type DeletableSyncOutbox,
} from '../../../../../synchronization/runtime/infrastructure/local-sync'
import type { SyncResource } from '#shared/domain/types/api-v1'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

function localRepository(): IActivitiesRepository {
  return {
    getAll: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
  }
}

function outbox(): DeletableSyncOutbox<SyncResource.ACTIVITIES> {
  return {
    update: vi.fn().mockImplementation(async (_userId, snapshot) => snapshot),
    delete: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue(undefined),
  }
}

describe('SyncingActivitiesRepository', () => {
  it('delegates the atomic local-first write to the outbox unit of work', async () => {
    const local = localRepository()
    const pending = outbox()
    const repository = new SyncingActivitiesRepository(local, pending)
    const activity = Activity.restore(
      persistedSnapshot({
        title: ' Study ',
        color: '#fff',
        sessions: [],
        allowOverlap: false,
      }),
    )

    const saved = await repository.create('user-1', activity)

    expect(local.create).not.toHaveBeenCalled()
    expect(pending.update).toHaveBeenCalledWith('user-1', activity.toSnapshot())
    expect(saved.toSnapshot()).toEqual(activity.toSnapshot())
  })

  it('delegates reads without creating an outbox operation', async () => {
    const local = localRepository()
    const pending = outbox()
    const repository = new SyncingActivitiesRepository(local, pending)

    await repository.getAll('user-1')

    expect(local.getAll).toHaveBeenCalledOnce()
    expect(pending.update).not.toHaveBeenCalled()
  })
})
