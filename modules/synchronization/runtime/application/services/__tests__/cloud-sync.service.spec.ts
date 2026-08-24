import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type {
  PersistedSyncOperation,
  RemoteCloudRecord,
  SyncConflictRecord,
} from '~~/modules/synchronization/runtime/contracts'
import type { CloudChangeApplier } from '../../ports/cloud-change-applier'
import type { CloudChangesGateway } from '../../ports/cloud-changes-gateway'
import type { SyncOperationGateway } from '../../ports/sync-operation-gateway'
import type { SyncStateRepository } from '../../ports/sync-state.repository'
import type { RemoteChange } from '../../../domain/models/remote-change'
import { CloudSyncService, compactOperations } from '../cloud-sync.service'
import type { ActivityID } from '#shared/domain/types/event'

function operation(
  sequence = 1,
): Extract<
  PersistedSyncOperation<SyncResource.ACTIVITIES>,
  { operation: SyncOperation.UPDATE }
> {
  const timestamp = '2026-01-01T00:00:00.000Z'
  const id = makeUUID<ActivityID>()
  return {
    operation: SyncOperation.UPDATE,
    resource: SyncResource.ACTIVITIES,
    entityId: id,
    operationId: makeUUID(),
    revision: 1,
    body: {
      id,
      title: 'Study',
      color: '#fff',
      allowOverlap: false,
      sessions: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: 'user-1',
      updatedBy: 'user-1',
    },
    userId: 'user-1',
    key: `pending-${sequence}`,
    createdAt: timestamp,
    sequence,
  }
}

function stateRepository(): SyncStateRepository {
  return {
    enqueue: vi.fn(),
    pending: vi.fn().mockResolvedValue([]),
    deletePending: vi.fn(),
    confirm: vi.fn(),
    cursor: vi.fn(),
    saveCursor: vi.fn(),
    conflicts: vi.fn().mockResolvedValue([]),
    conflict: vi.fn(),
    saveConflict: vi.fn(),
    deleteConflict: vi.fn(),
  }
}

function changesGateway(): CloudChangesGateway {
  return {
    changes: vi.fn(),
    conflict: vi.fn(),
    applyCloudRecord: vi.fn(),
  }
}

function operationGateway(): SyncOperationGateway {
  return { push: vi.fn() }
}

class NoopApplier implements CloudChangeApplier {
  async apply<R extends SyncResource>(
    _userId: string,
    _resource: R,
    _change: RemoteChange<R>,
  ) {}
  async applyCloudRecord(
    _userId: string,
    _record: RemoteCloudRecord,
    _revision: number,
  ) {}
}

describe('CloudSyncService', () => {
  it('compacts create followed by update into one create with the latest body', () => {
    const created = {
      ...operation(1),
      operation: SyncOperation.CREATE,
      revision: undefined,
    } as PersistedSyncOperation<SyncResource.ACTIVITIES>
    const updated = {
      ...operation(2),
      entityId: created.entityId,
      body: { ...created.body, title: 'Updated' } as typeof created.body,
    } as PersistedSyncOperation<SyncResource.ACTIVITIES>

    expect(compactOperations([created, updated])).toEqual([
      expect.objectContaining({
        operation: SyncOperation.CREATE,
        body: expect.objectContaining({ title: 'Updated' }),
        revision: undefined,
      }),
    ])
  })

  it('removes create followed by delete without sending either operation', () => {
    const created = {
      ...operation(1),
      operation: SyncOperation.CREATE,
      revision: undefined,
    } as PersistedSyncOperation<SyncResource.ACTIVITIES>
    const deleted = {
      ...operation(2),
      operation: SyncOperation.DELETE,
      entityId: created.entityId,
      body: undefined,
      revision: undefined,
    } as PersistedSyncOperation<SyncResource.ACTIVITIES>

    expect(compactOperations([created, deleted])).toEqual([])
  })

  it('preserves the original cloud revision through update and delete compaction', () => {
    const updated = operation(1)
    const latestUpdate = { ...operation(2), entityId: updated.entityId }
    const deleted = {
      ...latestUpdate,
      operation: SyncOperation.DELETE,
      body: undefined,
    } as PersistedSyncOperation<SyncResource.ACTIVITIES>

    expect(compactOperations([updated, latestUpdate])).toEqual([
      expect.objectContaining({ operation: SyncOperation.UPDATE, revision: 1 }),
    ])
    expect(compactOperations([updated, deleted])).toEqual([
      expect.objectContaining({ operation: SyncOperation.DELETE, revision: 1 }),
    ])
  })

  it('Given duplicate pending operations, when push succeeds, then stale commands are removed and the latest command is confirmed', async () => {
    const older = operation(1)
    const latest = { ...operation(2), entityId: older.entityId }
    const state = stateRepository()
    vi.mocked(state.pending).mockResolvedValue([latest, older])
    const operations = operationGateway()
    vi.mocked(operations.push).mockResolvedValue(7)
    const service = new CloudSyncService(changesGateway(), operations, state)

    await expect(service.push('user-1')).resolves.toEqual({
      pushed: 1,
      conflicts: 0,
    })
    expect(state.deletePending).toHaveBeenCalledWith(older.key)
    expect(operations.push).toHaveBeenCalledWith(latest)
    expect(state.confirm).toHaveBeenCalledWith(latest, latest.body.updatedAt, 7)
  })

  it('Given a cloud conflict, when push receives 409, then the conflict is retained and pending work is removed', async () => {
    const pending = operation()
    const state = stateRepository()
    vi.mocked(state.pending).mockResolvedValue([pending])
    const operations = operationGateway()
    vi.mocked(operations.push).mockRejectedValue(new Error('conflict'))
    const api = changesGateway()
    vi.mocked(api.conflict).mockReturnValue({
      status: 409,
      data: { revision: 8 },
    })
    const service = new CloudSyncService(api, operations, state)

    await expect(service.push('user-1')).resolves.toEqual({
      pushed: 0,
      conflicts: 1,
    })
    expect(state.saveConflict).toHaveBeenCalledWith(
      expect.objectContaining({ operation: pending, cloudRevision: 8 }),
    )
    expect(state.deletePending).toHaveBeenCalledWith(pending.key)
  })

  it('Given a non-conflict transport failure, when push runs, then the original failure is propagated', async () => {
    const state = stateRepository()
    vi.mocked(state.pending).mockResolvedValue([operation()])
    const operations = operationGateway()
    vi.mocked(operations.push).mockRejectedValue(new Error('offline'))
    const service = new CloudSyncService(changesGateway(), operations, state)
    await expect(service.push('user-1')).rejects.toThrow('offline')
  })

  it('Given a paginated feed, when pull runs, then every page is counted and each cursor is persisted', async () => {
    const state = stateRepository()
    vi.mocked(state.cursor).mockResolvedValue('before')
    const api = changesGateway()
    vi.mocked(api.changes)
      .mockResolvedValueOnce({ applied: 2, cursor: 'middle', hasMore: true })
      .mockResolvedValueOnce({ applied: 1, cursor: 'after', hasMore: false })
    const service = new CloudSyncService(api, operationGateway(), state)

    await expect(service.pull('user-1', new NoopApplier())).resolves.toBe(3)
    expect(state.saveCursor).toHaveBeenNthCalledWith(1, 'user-1', 'middle')
    expect(state.saveCursor).toHaveBeenNthCalledWith(2, 'user-1', 'after')
  })

  it('Given a page application failure, when pull runs, then the cursor is not advanced', async () => {
    const state = stateRepository()
    const api = changesGateway()
    vi.mocked(api.changes).mockRejectedValue(new Error('apply failed'))
    const service = new CloudSyncService(api, operationGateway(), state)
    await expect(service.pull('user-1', new NoopApplier())).rejects.toThrow(
      'apply failed',
    )
    expect(state.saveCursor).not.toHaveBeenCalled()
  })

  it('Given local and cloud conflict choices, when each is resolved, then the selected value is applied before cleanup', async () => {
    const pending = operation()
    const cloud: RemoteCloudRecord<SyncResource.ACTIVITIES> = {
      id: pending.entityId,
      resource: SyncResource.ACTIVITIES,
      data: pending.body,
      revision: 8,
      deletedAt: null,
    }
    const conflict: SyncConflictRecord = {
      key: 'conflict-1',
      operation: pending,
      cloud,
      cloudRevision: 8,
      createdAt: pending.createdAt,
    }
    const state = stateRepository()
    vi.mocked(state.conflict).mockResolvedValue(conflict)
    const api = changesGateway()
    const service = new CloudSyncService(api, operationGateway(), state)
    const handler = new NoopApplier()

    await service.resolve('user-1', conflict.key, 'local', handler)
    await service.resolve('user-1', conflict.key, 'cloud', handler)

    expect(state.enqueue).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ revision: 8 }),
    )
    expect(api.applyCloudRecord).toHaveBeenCalledWith(
      'user-1',
      handler,
      cloud,
      8,
    )
    expect(state.deleteConflict).toHaveBeenCalledTimes(2)
  })

  it('Given no matching conflict, when resolution is requested, then no state is changed', async () => {
    const state = stateRepository()
    vi.mocked(state.conflict).mockResolvedValue(undefined)
    const service = new CloudSyncService(
      changesGateway(),
      operationGateway(),
      state,
    )
    await service.resolve('user-1', 'missing', 'cloud', new NoopApplier())
    expect(state.deleteConflict).not.toHaveBeenCalled()
  })

  it('Given state operations, when facade methods delegate, then enqueue, pending, conflicts, and recording use the repository', async () => {
    const state = stateRepository()
    const pending = operation()
    vi.mocked(state.enqueue).mockResolvedValue(pending)
    vi.mocked(state.pending).mockResolvedValue([pending])
    const conflict: SyncConflictRecord = {
      key: 'c',
      operation: pending,
      createdAt: pending.createdAt,
    }
    vi.mocked(state.conflicts).mockResolvedValue([conflict])
    const service = new CloudSyncService(
      changesGateway(),
      operationGateway(),
      state,
    )
    await expect(service.enqueue('user-1', pending)).resolves.toBe(pending)
    await expect(service.pending('user-1')).resolves.toEqual([pending])
    await expect(service.conflicts('user-1')).resolves.toEqual([conflict])
    await service.recordConflict(conflict)
    expect(state.saveConflict).toHaveBeenCalledWith(conflict)
  })
})
