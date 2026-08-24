import type { PersistedSyncOperation } from '~~/modules/synchronization/runtime/contracts'
import type { SyncOperationGateway } from '../../application/ports/sync-operation-gateway'
import type { SyncOperationHandlerRegistry } from './sync-operation-handler-registry'

/** Dispatches commands to resource-specific strategies registered by the plugin. */
export class CloudSyncOperationGateway implements SyncOperationGateway {
  constructor(private readonly handlers: SyncOperationHandlerRegistry) {}

  push(operation: PersistedSyncOperation): Promise<number | null> {
    return this.handlers.resolve(operation.resource).push(operation)
  }
}
