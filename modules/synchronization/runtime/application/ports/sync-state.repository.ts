import type {
  PersistedSyncOperation,
  SyncConflictRecord,
  SyncOperationDto,
} from '~~/modules/synchronization/runtime/contracts'

export interface SyncStateRepository {
  enqueue(
    userId: string,
    operation: SyncOperationDto,
  ): Promise<PersistedSyncOperation>
  pending(userId: string): Promise<PersistedSyncOperation[]>
  deletePending(key: string): Promise<void>
  confirm(
    operation: PersistedSyncOperation,
    updatedAt?: string,
    revision?: number | null,
  ): Promise<void>
  cursor(userId: string): Promise<string | undefined>
  saveCursor(userId: string, cursor: string): Promise<void>
  conflicts(userId: string): Promise<SyncConflictRecord[]>
  conflict(userId: string, key: string): Promise<SyncConflictRecord | undefined>
  saveConflict(conflict: SyncConflictRecord): Promise<void>
  deleteConflict(key: string): Promise<void>
}
