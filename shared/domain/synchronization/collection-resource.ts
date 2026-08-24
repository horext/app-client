import { SyncResource } from './resource'
import { bulkCollectionResources } from './bulk-collection-resource'

export const regularCollectionResources = [
  SyncResource.ACTIVITIES,
  SyncResource.SUBJECTS,
  SyncResource.GENERATIONS,
  SyncResource.FAVORITES,
] as const

export type RegularCollectionResource =
  (typeof regularCollectionResources)[number]

export const collectionResources = [
  ...regularCollectionResources,
  ...bulkCollectionResources,
] as const

export type CollectionResource = (typeof collectionResources)[number]
