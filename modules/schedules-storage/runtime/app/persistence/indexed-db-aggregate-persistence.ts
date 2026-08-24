import type {
  DbFactory,
  ReplicableSchemas,
  ReplicableStore,
  ReplicableStoreValue,
} from '../context/db'
import type { AggregateSnapshot } from '#shared/domain/synchronization'
import type {
  AggregatePersistence,
  RemoteAggregatePersistence,
  ReplicableStoreCreate,
  ReplicableStoreCreateResult,
  ReplicableStoreUpdate,
  ReplicableStoreUpdateResult,
} from './aggregate-persistence'
import { makeUUID } from '~~/shared/domain/types/ids'

export class IndexedDbAggregatePersistence
  implements AggregatePersistence, RemoteAggregatePersistence
{
  constructor(private readonly getDb: DbFactory) {}

  async find<S extends ReplicableStore>(
    store: S,
    userId: string,
    id: ReplicableSchemas[S]['key'][1],
  ) {
    const db = await this.getDb()
    return db
      .transaction(store, 'readonly')
      .objectStore(store)
      .get([userId, id])
  }

  async findAll<S extends ReplicableStore>(store: S, userId: string) {
    const db = await this.getDb()
    return db
      .transaction(store, 'readonly')
      .objectStore(store)
      .index('createdBy')
      .getAll(IDBKeyRange.only(userId))
  }

  async findByIndex<S extends ReplicableStore>(
    store: S,
    index: keyof ReplicableSchemas[S]['indexes'] & string,
    key: IDBValidKey,
  ) {
    const db = await this.getDb()
    return db.getFromIndex(store, index, IDBKeyRange.only(key))
  }

  async findAllByIndex<S extends ReplicableStore>(
    store: S,
    index: keyof ReplicableSchemas[S]['indexes'] & string,
    key: IDBValidKey,
  ) {
    const db = await this.getDb()
    return db.getAllFromIndex(store, index, IDBKeyRange.only(key))
  }

  async create<S extends ReplicableStore>(
    store: S,
    value: ReplicableStoreCreate<S>,
    userId: string,
  ): Promise<ReplicableStoreCreateResult<S>> {
    const db = await this.getDb()
    const timestamp = new Date().toISOString()
    const record = {
      ...value,
      id: value.id ?? makeUUID<ReplicableSchemas[S]['key'][1]>(),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: userId,
      updatedBy: userId,
    }
    await db.add(store, record)
    return record
  }

  async update<S extends ReplicableStore>(
    store: S,
    value: ReplicableStoreUpdate<S>,
    userId: string,
  ): Promise<ReplicableStoreUpdateResult<S>> {
    const db = await this.getDb()
    const record = {
      ...value,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }
    await db.put(store, record)
    return record
  }

  async remove<S extends ReplicableStore>(
    store: S,
    userId: string,
    id: ReplicableSchemas[S]['key'][1],
  ) {
    const db = await this.getDb()
    await db.delete(store, [userId, id])
  }

  async saveRemote<S extends ReplicableStore>(
    store: S,
    value: ReplicableStoreValue<S>,
    userId: string,
  ) {
    const db = await this.getDb()
    await db.put(store, {
      ...value,
      createdBy: userId,
      updatedBy: userId,
      syncedAt: new Date().toISOString(),
      localSequence: 0,
    })
  }

  async replace<S extends ReplicableStore>(
    store: S,
    userId: string,
    items: AggregateSnapshot<ReplicableStoreValue<S>>[],
  ) {
    const db = await this.getDb()
    const tx = db.transaction(store, 'readwrite')
    const objectStore = tx.objectStore(store)
    const existing = await objectStore
      .index('createdBy')
      .getAll(IDBKeyRange.only(userId))
    for (const item of existing) await objectStore.delete([userId, item.id])
    for (const item of items)
      await objectStore.put({
        ...item.data,
        createdBy: userId,
        updatedBy: userId,
        revision: item.revision,
        syncedAt: new Date().toISOString(),
        localSequence: 0,
      })
    await tx.done
  }
}
