import type { UUID } from 'crypto'
import {
  StoresDB,
  type DbFactory,
} from '../../../../schedules-storage/runtime/app/context/db'
import { locallyUpdated } from '../../../../schedules-storage/runtime/app/persistence/local-record'
import type {
  BulkCollectionResource,
  CollectionResource,
  SyncCreateBodyMap,
  SyncBodyMap,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { nextPersistentSequence } from './persistent-sequence'
import type { SaveSyncOperationFactory } from './sync-operation-factories'
import { stores } from '~~/modules/schedules-storage/runtime/app/context'

export interface SyncOutbox<R extends SyncResource> {
  create(
    userId: string,
    snapshot: SyncCreateBodyMap<R>,
  ): Promise<SyncBodyMap<R>>
  update(userId: string, snapshot: SyncBodyMap<R>): Promise<SyncBodyMap<R>>
}

export interface CollectionSyncOutbox<
  R extends CollectionResource,
> extends SyncOutbox<R> {
  delete(userId: string, id: UUID): Promise<void>
}

export interface BulkCollectionSyncOutbox<
  R extends BulkCollectionResource,
> extends CollectionSyncOutbox<R> {
  createAll(
    userId: string,
    snapshots: SyncCreateBodyMap<R>[],
  ): Promise<SyncBodyMap<R>[]>
  updateAll(
    userId: string,
    snapshots: SyncBodyMap<R>[],
  ): Promise<SyncBodyMap<R>[]>
  deleteAll(userId: string, ids: UUID[]): Promise<void>
}

export class BaseSyncOutbox<
  R extends SyncResource,
  O extends SaveSyncOperationFactory<SyncResource>,
> {
  constructor(
    protected readonly dbFactory: DbFactory,
    protected readonly resource: R,
    protected readonly operations: O,
    protected readonly storeName = stores[resource],
  ) {}

  async create(
    userId: string,
    snapshot: SyncCreateBodyMap<R>,
  ): Promise<SyncBodyMap<R>> {
    const db = await this.dbFactory()
    const tx = db.transaction(
      [this.storeName, StoresDB.OUTBOX, StoresDB.SYNC_STATE],
      'readwrite',
    )
    const timestamp = new Date().toISOString()
    const completeSnapshot = {
      ...snapshot,
      id: ('id' in snapshot && snapshot.id) || crypto.randomUUID(),
      createdAt: 'createdAt' in snapshot ? snapshot.createdAt : timestamp,
      updatedAt: timestamp,
    }
    const id = completeSnapshot.id
    const store = tx.objectStore(this.storeName)
    const previous = await store.get([userId, id])
    const sequence = await nextPersistentSequence(tx as never, userId)
    const record = locallyUpdated(
      completeSnapshot,
      userId,
      sequence,
      previous as SyncBodyMap<R> | undefined,
    ) as SyncBodyMap<R>
    await store.put(record)
    const operation = this.operations.create(record)
    tx.objectStore(StoresDB.OUTBOX).put({
      ...operation,
      userId,
      revision: operation.revision ?? previous?.revision ?? undefined,
      key: operation.operationId,
      createdAt: new Date().toISOString(),
      sequence,
    })
    await tx.done
    return record
  }

  async update(
    userId: string,
    snapshot: SyncBodyMap<R>,
  ): Promise<SyncBodyMap<R>> {
    const db = await this.dbFactory()
    const tx = db.transaction(
      [this.storeName, StoresDB.OUTBOX, StoresDB.SYNC_STATE],
      'readwrite',
    )
    const timestamp = new Date().toISOString()
    const completeSnapshot = {
      ...snapshot,
      id: snapshot.id ?? crypto.randomUUID(),
      createdAt: 'createdAt' in snapshot ? snapshot.createdAt : timestamp,
      updatedAt: timestamp,
    }
    const id = completeSnapshot.id
    const store = tx.objectStore(this.storeName)
    const previous = await store.get([userId, id])
    const sequence = await nextPersistentSequence(tx as never, userId)
    const record = locallyUpdated(
      completeSnapshot,
      userId,
      sequence,
      previous as SyncBodyMap<R> | undefined,
    )
    await store.put(record)
    const operation = this.operations.update(record)
    tx.objectStore(StoresDB.OUTBOX).put({
      ...operation,
      userId,
      revision: operation.revision ?? previous?.revision ?? undefined,
      key: operation.operationId,
      createdAt: new Date().toISOString(),
      sequence,
    })
    await tx.done
    return record
  }
}
