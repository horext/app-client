import type {
  IAcademicConfig,
  IBaseAcademicConfig,
} from '#shared/domain/types/academic-config'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'
import type {
  IBasePreferences,
  IPreferences,
} from '#shared/domain/types/preferences'
import type { IBaseProfile, IProfile } from '#shared/domain/types/profile'
import type {
  IBaseGeneratedSchedule,
  IBaseScheduleFavorite,
  IGeneratedSchedule,
  IScheduleFavorite,
} from '#shared/domain/types/schedule'
import type {
  IBaseScheduleGeneration,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'
import type {
  IBasePlannedSubject,
  IPlannedSubject,
} from '#shared/domain/types/subject'
import type {
  SyncResource,
  CollectionResource,
} from '#shared/domain/synchronization'

export {
  bulkCollectionResources,
  collectionResources,
  individualResources,
  regularCollectionResources,
  SyncResource,
} from '#shared/domain/synchronization'
export type {
  AggregateSnapshot,
  BulkCollectionResource,
  CollectionResource,
  IndividualResource,
  RegularCollectionResource,
} from '#shared/domain/synchronization'

export enum SyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
export type SyncPayloads = {
  [SyncResource.PROFILE]: IProfile
  [SyncResource.PREFERENCES]: IPreferences
  [SyncResource.ACADEMIC_CONFIG]: IAcademicConfig
  [SyncResource.ACTIVITIES]: IActivity
  [SyncResource.SUBJECTS]: IPlannedSubject
  [SyncResource.SCHEDULES]: IGeneratedSchedule
  [SyncResource.GENERATIONS]: IScheduleGeneration
  [SyncResource.FAVORITES]: IScheduleFavorite
}
export type SyncCreatePayloads = {
  [SyncResource.PROFILE]: IBaseProfile
  [SyncResource.PREFERENCES]: IBasePreferences
  [SyncResource.ACADEMIC_CONFIG]: IBaseAcademicConfig
  [SyncResource.ACTIVITIES]: IBaseActivity
  [SyncResource.SUBJECTS]: IBasePlannedSubject
  [SyncResource.SCHEDULES]: IBaseGeneratedSchedule
  [SyncResource.GENERATIONS]: IBaseScheduleGeneration
  [SyncResource.FAVORITES]: IBaseScheduleFavorite
}
export type SyncBodyMap<R extends SyncResource = SyncResource> =
  SyncPayloads[R] & { syncedAt?: string; localSequence?: number }
export type SyncCreateBodyMap<R extends SyncResource = SyncResource> =
  SyncCreatePayloads[R] & { syncedAt?: string; localSequence?: number }
export interface RemoteCloudRecord<R extends SyncResource = SyncResource> {
  id: string
  resource: R
  data: SyncBodyMap<R> | null
  revision: number
  deletedAt: string | null
}
export type SyncOperationDto<R extends SyncResource = SyncResource> = {
  operation: SyncOperation
  resource: R
  entityId: string
  body?: SyncBodyMap<R>
  operationId: string
  revision?: number
}
export type CreateOperation<R extends SyncResource> = SyncOperationDto<R> & {
  operation: SyncOperation.CREATE
  body: SyncBodyMap<R>
}
export type UpdateOperation<R extends SyncResource> = SyncOperationDto<R> & {
  operation: SyncOperation.UPDATE
  body: SyncBodyMap<R>
}
export type CollectionDeleteOperation<R extends CollectionResource> =
  SyncOperationDto<R> & {
    operation: SyncOperation.DELETE
    body?: never
  }
type PersistedOperationMetadata = {
  key: string
  userId: string
  sequence: number
  createdAt: string
}
export type PersistedSyncOperation<R extends SyncResource = SyncResource> = (
  | CreateOperation<R>
  | UpdateOperation<R>
  | (R extends CollectionResource ? CollectionDeleteOperation<R> : never)
) &
  PersistedOperationMetadata
export interface SyncConflictRecord {
  key: string
  operation: PersistedSyncOperation
  cloud?: RemoteCloudRecord
  cloudRevision?: number
  createdAt: string
}
