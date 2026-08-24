import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { SyncOperationHandler } from '../sync-operation-handler'
import { SyncOperationHandlerRegistry } from '../sync-operation-handler-registry'

describe('SyncOperationHandlerRegistry', () => {
  it('Given a registered handler, when its resource is resolved, then commands are delegated', async () => {
    const push = vi.fn<SyncOperationHandler<SyncResource.ACTIVITIES>['push']>()
    push.mockResolvedValue(4)
    const handler: SyncOperationHandler<SyncResource.ACTIVITIES> = {
      resource: SyncResource.ACTIVITIES,
      push,
    }
    const registry = new SyncOperationHandlerRegistry().register(handler)
    const operation = {
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: makeUUID(),
      operationId: makeUUID(),
      revision: 3,
      userId: 'user-1',
      key: 'pending-1',
      createdAt: '',
      sequence: 1,
    } satisfies Parameters<typeof push>[0]
    await expect(
      registry.resolve(SyncResource.ACTIVITIES).push(operation),
    ).resolves.toBe(4)
  })

  it('Given no handler, when a resource is resolved, then a descriptive error is thrown', () => {
    expect(() =>
      new SyncOperationHandlerRegistry().resolve(SyncResource.PROFILE),
    ).toThrow('No synchronization handler for profile')
  })
})
