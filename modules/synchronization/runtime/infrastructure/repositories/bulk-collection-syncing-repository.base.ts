import type { UUID } from 'crypto'
import type {
  BulkCollectionResource,
  SyncCreateBodyMap,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type { BulkCollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import { CollectionSyncingRepository } from './collection-syncing-repository.base'

export abstract class BulkCollectionSyncingRepository<
  T,
  C,
  R extends BulkCollectionResource,
> extends CollectionSyncingRepository<T, C, R> {
  constructor(
    protected readonly bulkOutbox: BulkCollectionSyncOutbox<R>,
    restore: (snapshot: SyncBodyMap<R>) => T,
    serializeCreate: (value: C) => SyncCreateBodyMap<R>,
    serializeUpdate: (value: T) => SyncBodyMap<R>,
  ) {
    super(bulkOutbox, restore, serializeCreate, serializeUpdate)
  }

  async createAll(userId: string, values: C[]): Promise<T[]> {
    return (
      await this.bulkOutbox.createAll(
        userId,
        values.map((value) => this.serializeCreate(value)),
      )
    ).map((snapshot) => this.restore(snapshot))
  }

  async updateAll(userId: string, values: T[]): Promise<T[]> {
    return (
      await this.bulkOutbox.updateAll(
        userId,
        values.map((value) => this.serializeUpdate(value)),
      )
    ).map((snapshot) => this.restore(snapshot))
  }

  deleteAll(userId: string, ids: UUID[]): Promise<void> {
    return this.bulkOutbox.deleteAll(userId, ids)
  }
}
