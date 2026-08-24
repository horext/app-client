import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { CloudSyncOperationGateway } from '../cloud-sync-operation.gateway'
import { SyncOperationHandlerRegistry } from '../sync-operation-handler-registry'
import type { SyncOperationHandler } from '../sync-operation-handler'

describe('CloudSyncOperationGateway', () => {
  it('Given a registered resource handler, when an operation is pushed, then it dispatches the operation', async () => {
    const push = vi.fn<SyncOperationHandler<SyncResource.ACTIVITIES>['push']>()
    push.mockResolvedValue(8)
    const handler: SyncOperationHandler<SyncResource.ACTIVITIES> = {
      resource: SyncResource.ACTIVITIES,
      push,
    }
    const gateway = new CloudSyncOperationGateway(
      new SyncOperationHandlerRegistry().register(handler),
    )
    const operation = {
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: makeUUID(),
      operationId: makeUUID(),
      revision: 7,
      userId: 'user-1',
      key: 'pending-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      sequence: 1,
    } satisfies Parameters<typeof gateway.push>[0]

    await expect(gateway.push(operation)).resolves.toBe(8)
    expect(push).toHaveBeenCalledWith(operation)
  })
})
