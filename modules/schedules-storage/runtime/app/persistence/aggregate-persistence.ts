import type { DbFactory, Schemas, Stores } from '../context/db'

export interface AggregatePersistence {
  find<S extends Stores>(
    store: S,
    userId: string,
    id: Schemas[S]['key'][1],
  ): Promise<Schemas[S]['value'] | undefined>
  findAll<S extends Stores>(
    store: S,
    userId: string,
  ): Promise<Schemas[S]['value'][]>
  findByIndex<S extends Stores>(
    store: S,
    index: keyof Schemas[S]['indexes'] & string,
    key: IDBValidKey,
  ): Promise<Schemas[S]['value'] | undefined>
  create<S extends Stores>(
    store: S,
    value: Exclude<
      Schemas[S]['value'],
      'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
    >,
    userId: string,
  ): Promise<Schemas[S]['value']>
  update<S extends Stores>(
    store: S,
    value: Exclude<Schemas[S]['value'], 'updatedAt' | 'updatedBy'>,
    userId: string,
  ): Promise<Schemas[S]['value']>
  remove<S extends Stores>(
    store: S,
    userId: string,
    id: Schemas[S]['key'][1],
  ): Promise<void>
}

export class IndexedDbAggregatePersistence implements AggregatePersistence {
  constructor(private readonly getDb: DbFactory) {}

  async find<S extends Stores>(
    store: S,
    userId: string,
    id: Schemas[S]['key'][1],
  ) {
    const db = await this.getDb()
    return db
      .transaction(store, 'readonly')
      .objectStore(store)
      .get([userId, id])
  }

  async findAll<S extends Stores>(store: S, userId: string) {
    const db = await this.getDb()
    return db
      .transaction(store, 'readonly')
      .objectStore(store)
      .index('createdBy')
      .getAll(IDBKeyRange.only(userId))
  }

  async findByIndex<S extends Stores>(
    store: S,
    index: keyof Schemas[S]['indexes'] & string,
    key: IDBValidKey,
  ) {
    const db = await this.getDb()
    return db.getFromIndex(store, index, IDBKeyRange.only(key))
  }

  async create<S extends Stores>(
    store: S,
    value: Exclude<
      Schemas[S]['value'],
      'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
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
    }
    await db.put(store, record)
    return record
  }

  async update<S extends Stores>(
    store: S,
    value: Exclude<Schemas[S]['value'], 'updatedAt' | 'updatedBy'>,
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

  async remove<S extends Stores>(
    store: S,
    userId: string,
    id: Schemas[S]['key'][1],
  ) {
    const db = await this.getDb()
    await db.delete(store, [userId, id])
  }
}
