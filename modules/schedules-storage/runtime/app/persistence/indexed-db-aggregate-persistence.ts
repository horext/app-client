import type {
  DbFactory,
  ReplicableSchemas,
  ReplicableStore,
} from '../context/db'
import type { AggregateSnapshot } from '#shared/domain/types/api-v1'
import type {
  AggregatePersistence,
  RemoteAggregatePersistence,
} from './aggregate-persistence'

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
    value: Omit<
      ReplicableSchemas[S]['value'],
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
    >,
    userId: string,
  ) {
    const db = await this.getDb()
    const timestamp = new Date().toISOString()
    const record = {
      ...value,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: userId,
      updatedBy: userId,
      id: crypto.randomUUID(),
    }
    await db.add(store, record)
    return record
  }

  async update<S extends ReplicableStore>(
    store: S,
    value: Omit<ReplicableSchemas[S]['value'], 'updatedAt' | 'updatedBy'>,
    userId: string,
  ) {
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
    value: ReplicableSchemas[S]['value'],
    userId: string,
  ) {
    const db = await this.getDb()
    await db.put(store, {
      ...value,
      createdBy: userId,
      updatedBy: userId,
      syncedAt: new Date().toISOString(),
      localSequence: 0,
    } satisfies ReplicableSchemas[S]['value'])
  }

  async replace<S extends ReplicableStore>(
    store: S,
    userId: string,
    items: AggregateSnapshot<ReplicableSchemas[S]['value']>[],
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
      } satisfies ReplicableSchemas[S]['value'])
    await tx.done
  }
}
