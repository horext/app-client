import type { PersistedSyncOperation } from '~~/modules/synchronization/runtime/contracts'

export interface SyncOperationGateway {
  push(operation: PersistedSyncOperation): Promise<number | null>
}
