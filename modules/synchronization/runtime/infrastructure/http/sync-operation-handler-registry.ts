import type {
  PersistedSyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { SyncOperationHandler } from './sync-operation-handler'

type ErasedHandler<R extends SyncResource> = {
  push(operation: PersistedSyncOperation<R>): Promise<number | null>
}

export class SyncOperationHandlerRegistry<
  R extends SyncResource = SyncResource,
> {
  private readonly handlers = new Map<R, ErasedHandler<R>>()

  register(handler: SyncOperationHandler<R>): this {
    this.handlers.set(handler.resource, {
      push: (operation) => {
        if (operation.resource !== handler.resource)
          throw new Error(
            `Handler for ${handler.resource} cannot process ${operation.resource}.`,
          )
        return handler.push(operation)
      },
    })
    return this
  }

  resolve(resource: R): ErasedHandler<R> {
    const handler = this.handlers.get(resource)
    if (!handler) throw new Error(`No synchronization handler for ${resource}.`)
    return handler
  }
}
