import type { UUID } from 'crypto'
import { StoresDB } from '../../../../schedules-storage/runtime/app/context/db'
import type {
  BulkCollectionResource,
  SyncCreateBodyMap,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import { nextPersistentSequence } from './persistent-sequence'
import type { BulkCollectionSyncOutbox } from './sync-outbox-base'
import { IndexedDbCollectionSyncOutbox } from './indexed-db-collection-sync-outbox'

export class IndexedDbBulkCollectionSyncOutbox<R extends BulkCollectionResource>
  extends IndexedDbCollectionSyncOutbox<R>
  implements BulkCollectionSyncOutbox<R>
{
  async createAll(userId: string, snapshots: SyncCreateBodyMap<R>[]) {
    const created: SyncBodyMap<R>[] = []
    for (const snapshot of snapshots)
      created.push(await this.create(userId, snapshot))
    return created
  }
  async updateAll(userId: string, snapshots: SyncBodyMap<R>[]) {
    const updated: SyncBodyMap<R>[] = []
    for (const snapshot of snapshots)
      updated.push(await this.update(userId, snapshot))
    return updated
  }
  async deleteAll(userId: string, ids: UUID[]) {
    if (ids.length === 0) return
    const db = await this.dbFactory()
    const tx = db.transaction(
      [this.storeName, StoresDB.OUTBOX, StoresDB.SYNC_STATE],
      'readwrite',
    )
    const store = tx.objectStore(this.storeName)
    const outbox = tx.objectStore(StoresDB.OUTBOX)
    for (const id of ids) {
      const previous = await store.get([userId, id])
      const sequence = await nextPersistentSequence(tx as never, userId)
      await store.delete([userId, id])
      const operation = this.operations.delete(id)
      outbox.put({
        ...operation,
        userId,
        revision: operation.revision ?? previous?.revision ?? undefined,
        key: operation.operationId,
        createdAt: new Date().toISOString(),
        sequence,
      })
    }
    await tx.done
  }
}
