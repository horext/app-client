import { SyncResource } from './resource'

export const bulkCollectionResources = [SyncResource.SCHEDULES] as const

export type BulkCollectionResource = (typeof bulkCollectionResources)[number]
