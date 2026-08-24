import {
  collectionResources,
  individualResources,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { ReplicableStore } from './db'
import { StoresDB } from './db'

/** Maps cloud resources to their local aggregate store. */
export const stores = {
  [SyncResource.PROFILE]: StoresDB.PROFILE,
  [SyncResource.PREFERENCES]: StoresDB.PREFERENCES,
  [SyncResource.ACADEMIC_CONFIG]: StoresDB.ACADEMIC_CONFIG,
  [SyncResource.ACTIVITIES]: StoresDB.ACTIVITIES,
  [SyncResource.SUBJECTS]: StoresDB.SUBJECTS,
  [SyncResource.SCHEDULES]: StoresDB.SCHEDULES,
  [SyncResource.GENERATIONS]: StoresDB.GENERATIONS,
  [SyncResource.FAVORITES]: StoresDB.FAVORITES,
} as const satisfies Record<SyncResource, ReplicableStore>

export type SyncResourceStore = typeof stores

export const individualStores: readonly ReplicableStore[] =
  individualResources.map((resource) => stores[resource])

export const collectionStores: readonly ReplicableStore[] =
  collectionResources.map((resource) => stores[resource])

export const replicableStores: readonly ReplicableStore[] = [
  ...individualStores,
  ...collectionStores,
]
