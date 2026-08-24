import type { UUID } from 'crypto'
import { StoresDB } from '../../../../schedules-storage/runtime/app/context/db'
import type { CollectionResource } from '~~/modules/synchronization/runtime/contracts'
import { nextPersistentSequence } from './persistent-sequence'
import type { CollectionSyncOperationFactory } from './sync-operation-factories'
import { BaseSyncOutbox, type CollectionSyncOutbox } from './sync-outbox-base'

export class IndexedDbCollectionSyncOutbox<R extends CollectionResource>
  extends BaseSyncOutbox<R, CollectionSyncOperationFactory<CollectionResource>>
  implements CollectionSyncOutbox<R>
{
  async delete(userId: string, id: UUID): Promise<void> {
    const db = await this.dbFactory()
    const tx = db.transaction(
      [this.storeName, StoresDB.OUTBOX, StoresDB.SYNC_STATE],
      'readwrite',
    )
    const store = tx.objectStore(this.storeName)
    const previous = await store.get([userId, id])
    const sequence = await nextPersistentSequence(tx as never, userId)
    await store.delete([userId, id])
    const operation = this.operations.delete(id)
    tx.objectStore(StoresDB.OUTBOX).put({
      ...operation,
      userId,
      revision: operation.revision ?? previous?.revision ?? undefined,
      key: operation.operationId,
      createdAt: new Date().toISOString(),
      sequence,
    })
    await tx.done
  }
}
