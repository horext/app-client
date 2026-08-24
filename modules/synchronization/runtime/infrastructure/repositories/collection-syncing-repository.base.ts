import type { UUID } from 'crypto'
import type {
  CollectionResource,
  SyncCreateBodyMap,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import { BaseSyncingRepository } from './syncing-repository.base'

export abstract class CollectionSyncingRepository<
  T,
  C,
  R extends CollectionResource,
> extends BaseSyncingRepository<T, C, R> {
  constructor(
    protected readonly collectionOutbox: CollectionSyncOutbox<R>,
    restore: (snapshot: SyncBodyMap<R>) => T,
    serializeCreate: (value: C) => SyncCreateBodyMap<R>,
    serializeUpdate: (value: T) => SyncBodyMap<R>,
  ) {
    super(collectionOutbox, restore, serializeCreate, serializeUpdate)
  }

  delete(userId: string, id: UUID): Promise<void> {
    return this.collectionOutbox.delete(userId, id)
  }
}
