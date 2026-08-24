import type { DbFactory } from '../../../../schedules-storage/runtime/app/context/db'
import { BaseSyncOutbox } from './sync-outbox-base'
import { IndexedDbCollectionSyncOutbox } from './indexed-db-collection-sync-outbox'
import { IndexedDbBulkCollectionSyncOutbox } from './indexed-db-bulk-collection-sync-outbox'
import { SaveSyncOperationFactoryImpl } from './sync-operation-factories'
import { CollectionSyncOperationFactoryImpl } from './collection-sync-operation-factory'
import type { SaveSyncOperationFactory } from './sync-operation-factories'
import {
  SyncResource,
  type BulkCollectionResource,
  type CollectionResource,
  type IndividualResource,
} from '~~/modules/synchronization/runtime/contracts'

export function createIndexedDbSyncOutboxes(db: DbFactory) {
  const createCollection = <S extends CollectionResource>(resource: S) =>
    new IndexedDbCollectionSyncOutbox(
      db,
      resource,
      new CollectionSyncOperationFactoryImpl<CollectionResource>(resource),
    )
  const createBulkCollection = <S extends BulkCollectionResource>(
    resource: S,
  ) =>
    new IndexedDbBulkCollectionSyncOutbox(
      db,
      resource,
      new CollectionSyncOperationFactoryImpl<BulkCollectionResource>(resource),
    )
  const createIndividual = <S extends IndividualResource>(resource: S) =>
    new BaseSyncOutbox<S, SaveSyncOperationFactory<IndividualResource>>(
      db,
      resource,
      new SaveSyncOperationFactoryImpl<IndividualResource>(resource),
    )
  return {
    academicConfig: createIndividual(SyncResource.ACADEMIC_CONFIG),
    activities: createCollection(SyncResource.ACTIVITIES),
    favorites: createCollection(SyncResource.FAVORITES),
    generations: createCollection(SyncResource.GENERATIONS),
    preferences: createIndividual(SyncResource.PREFERENCES),
    profile: createIndividual(SyncResource.PROFILE),
    schedules: createBulkCollection(SyncResource.SCHEDULES),
    subjects: createCollection(SyncResource.SUBJECTS),
  }
}
