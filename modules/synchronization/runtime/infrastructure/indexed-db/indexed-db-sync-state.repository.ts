import {
  StoresDB,
  type DbFactory,
} from '~~/modules/schedules-storage/runtime/app/context/db'
import type {
  PersistedSyncOperation,
  SyncConflictRecord,
  SyncOperationDto,
} from '~~/modules/synchronization/runtime/contracts'
import { nextPersistentSequence } from './persistent-sequence'
import { stores } from '~~/modules/schedules-storage/runtime/app/context'

/** Repository for synchronization state; it deliberately excludes aggregates. */
export class IndexedDbSyncStateRepository {
  constructor(private readonly db: DbFactory) {}
  async enqueue(
    userId: string,
    operation: SyncOperationDto,
  ): Promise<PersistedSyncOperation> {
    const db = await this.db()
    const tx = db.transaction(
      [StoresDB.OUTBOX, StoresDB.SYNC_STATE],
      'readwrite',
    )
    const sequence = await nextPersistentSequence(tx as never, userId)
    const pending: PersistedSyncOperation = {
      ...operation,
      userId,
      key: operation.operationId,
      createdAt: new Date().toISOString(),
      sequence,
    } as PersistedSyncOperation
    await tx.objectStore(StoresDB.OUTBOX).put(pending)
    await tx.done
    return pending
  }

  async pending(userId: string): Promise<PersistedSyncOperation[]> {
    return (await this.db())
      .getAll(StoresDB.OUTBOX)
      .then((items) => items.filter((item) => item.userId === userId))
  }

  async deletePending(key: string): Promise<void> {
    await (await this.db()).delete(StoresDB.OUTBOX, key)
  }

  async conflicts(userId: string): Promise<SyncConflictRecord[]> {
    return (await this.db())
      .getAll(StoresDB.CONFLICTS)
      .then((items) => items.filter((item) => item.operation.userId === userId))
  }

  async conflict(
    userId: string,
    key: string,
  ): Promise<SyncConflictRecord | undefined> {
    const conflict = await (await this.db()).get(StoresDB.CONFLICTS, key)
    return conflict?.operation.userId === userId ? conflict : undefined
  }

  async saveConflict(conflict: SyncConflictRecord): Promise<void> {
    await (await this.db()).put(StoresDB.CONFLICTS, conflict)
  }

  async deleteConflict(key: string): Promise<void> {
    await (await this.db()).delete(StoresDB.CONFLICTS, key)
  }

  async cursor(userId: string): Promise<string | undefined> {
    return (await this.db())
      .get(StoresDB.SYNC_STATE, cursorKey(userId))
      .then((item) => item?.value)
  }

  async saveCursor(userId: string, cursor: string): Promise<void> {
    await (
      await this.db()
    ).put(StoresDB.SYNC_STATE, { key: cursorKey(userId), value: cursor })
  }

  async confirm(
    operation: PersistedSyncOperation,
    _submittedUpdatedAt: string | undefined,
    revision: number | null,
  ): Promise<void> {
    const db = await this.db()
    const storeName = stores[operation.resource]
    const tx = db.transaction([StoresDB.OUTBOX, storeName], 'readwrite')
    await tx.objectStore(StoresDB.OUTBOX).delete(operation.key)
    if (revision !== null && operation.body) {
      const store = tx.objectStore(storeName)
      const current = await store.get([operation.userId, operation.entityId])
      if (current) {
        await store.put({
          ...current,
          revision,
          syncedAt: new Date().toISOString(),
        })
      }
    }
    await tx.done
  }
}

function cursorKey(userId: string): string {
  return `cursor:${userId}`
}
