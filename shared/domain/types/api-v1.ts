import type { IActivity } from './event'
import type { IFavoriteSchedule, IScheduleGenerate } from './schedule'
import type { IGenerationRecord } from './generation-record'
import type { ISubjectSchedules } from './subject'
import type { IAcademicConfig } from './academic-config'
import type { IPreferences } from './preferences'
import type { IProfile } from './profile'

export type SyncResource =
  | 'profile'
  | 'preferences'
  | 'academic-config'
  | 'activities'
  | 'subjects'
  | 'schedules'
  | 'generations'
  | 'favorites'

type SyncBodyMap = {
  profile: IProfile
  preferences: IPreferences
  'academic-config': IAcademicConfig
  activities: IActivity
  subjects: ISubjectSchedules
  schedules: IScheduleGenerate
  generations: IGenerationRecord
  favorites: IFavoriteSchedule
}

type PutOperation<R extends SyncResource> = {
  method: 'PUT'
  resource: R
  entityId: string
  body: SyncBodyMap[R]
  operationId: string
  etag?: string
}

type DeleteOperation = {
  [R in Exclude<SyncResource, 'profile' | 'preferences' | 'academic-config'>]: {
    method: 'DELETE'
    resource: R
    entityId: string
    operationId: string
    etag?: string
  }
}[Exclude<SyncResource, 'profile' | 'preferences' | 'academic-config'>]

export type SyncOperationDto =
  | {
      [R in SyncResource]: PutOperation<R>
    }[SyncResource]
  | DeleteOperation

export type PersistedSyncOperation = SyncOperationDto & {
  userId: string
  key: string
  createdAt: string
  sequence: number
}

export interface SyncConflictRecord {
  key: string
  operation: PersistedSyncOperation
  cloud?: unknown
  cloudEtag?: string
  createdAt: string
}

/** Serializable aggregate envelope shared by persistence and synchronization. */
export interface AggregateSnapshot<T> {
  id: string
  data: T
  etag?: string
  createdAt?: string
  updatedAt?: string
}
