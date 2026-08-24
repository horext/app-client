import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncMutationApiGateway } from '../sync-mutation-api.gateway'
import { CollectionApiSyncOperationHandler } from '../collection-api-sync-operation-handler'

describe('CollectionApiSyncOperationHandler', () => {
  it('Given a revisioned delete, when it is pushed, then it deletes and returns the response revision', async () => {
    const api: CollectionSyncMutationApiGateway<SyncResource.ACTIVITIES> = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi
        .fn()
        .mockResolvedValue({ headers: new Headers({ etag: '"9"' }) }),
    }
    const handler = new CollectionApiSyncOperationHandler(
      SyncResource.ACTIVITIES,
      api,
    )
    const id = makeUUID()
    const operation = {
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: id,
      operationId: makeUUID(),
      revision: 8,
      userId: 'user-1',
      key: 'pending-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      sequence: 1,
    } satisfies Parameters<typeof handler.push>[0]

    await expect(handler.push(operation)).resolves.toBe(9)
    expect(api.delete).toHaveBeenCalledWith(id, 8)
  })

  it('Given an unrevisioned delete, when it is pushed, then it rejects the command', async () => {
    const api: CollectionSyncMutationApiGateway<SyncResource.ACTIVITIES> = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const handler = new CollectionApiSyncOperationHandler(
      SyncResource.ACTIVITIES,
      api,
    )
    const operation = {
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: makeUUID(),
      operationId: makeUUID(),
      userId: 'user-1',
      key: 'pending-1',
      createdAt: '',
      sequence: 1,
    } satisfies Parameters<typeof handler.push>[0]

    await expect(handler.push(operation)).rejects.toThrow('requires a revision')
  })
})
