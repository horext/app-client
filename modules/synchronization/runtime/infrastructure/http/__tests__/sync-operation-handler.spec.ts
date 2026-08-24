import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
  type PersistedSyncOperation,
} from '~~/modules/synchronization/runtime/contracts'
import { CollectionApiSyncOperationHandler } from '../collection-api-sync-operation-handler'
import { SyncOperationHandlerRegistry } from '../sync-operation-handler-registry'
import { CloudSyncOperationGateway } from '../cloud-sync-operation.gateway'
import { persistedSnapshot } from '../../../../../schedules-storage/runtime/shared/__tests__/persisted-snapshot'

function activityOperation(
  operation: SyncOperation.CREATE | SyncOperation.DELETE,
): PersistedSyncOperation<SyncResource.ACTIVITIES> {
  const common = {
    resource: SyncResource.ACTIVITIES,
    entityId: makeUUID(),
    operationId: makeUUID(),
    userId: 'user-1',
    key: makeUUID(),
    createdAt: new Date().toISOString(),
    sequence: 1,
  } satisfies Omit<
    PersistedSyncOperation<SyncResource.ACTIVITIES>,
    'operation' | 'body' | 'revision'
  >
  if (operation === SyncOperation.DELETE)
    return {
      ...common,
      operation,
      revision: 4,
    }
  return {
    ...common,
    operation,
    body: persistedSnapshot({
      title: 'Study',
      color: '#fff',
      sessions: [],
      allowOverlap: false,
    }),
  }
}

describe('sync operation handler registry', () => {
  it('Given a registered create command, when it is dispatched, then the response revision is returned', async () => {
    const create = vi.fn().mockResolvedValue({
      headers: new Headers({ etag: '"7"' }),
    })
    const api = {
      create,
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
    }
    const registry = new SyncOperationHandlerRegistry().register(
      new CollectionApiSyncOperationHandler(SyncResource.ACTIVITIES, api),
    )

    const operation = activityOperation(SyncOperation.CREATE)
    await expect(
      new CloudSyncOperationGateway(registry).push(operation),
    ).resolves.toBe(7)
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Study' }),
      operation.operationId,
    )
  })

  it('Given an unregistered resource, when a command is dispatched, then an unsupported-resource error is raised', () => {
    const gateway = new CloudSyncOperationGateway(
      new SyncOperationHandlerRegistry(),
    )
    expect(() => gateway.push(activityOperation(SyncOperation.DELETE))).toThrow(
      'No synchronization handler for activities.',
    )
  })

  it('Given a delete command with a stored revision, when it is dispatched, then the handler receives that revision', async () => {
    const remove = vi.fn().mockResolvedValue({ headers: new Headers() })
    const api = {
      create: vi.fn(),
      update: vi.fn(),
      delete: remove,
      list: vi.fn(),
    }
    const operation = activityOperation(SyncOperation.DELETE)
    const handler = new CollectionApiSyncOperationHandler(
      SyncResource.ACTIVITIES,
      api,
    )

    await handler.push(operation)

    expect(remove).toHaveBeenCalledWith(operation.entityId, 4)
  })
})
