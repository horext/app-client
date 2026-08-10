import type { IActivity } from './event'
import type { IFavoriteSchedule, IScheduleGenerate } from './schedule'
import type { IGenerationRecord } from './generation-record'
import type { ISubjectSchedules } from './subject'
import type { IAcademicConfig } from './academic-config'
import type { IPreferences } from './preferences'
import type { IProfile } from './profile'
import type { ReplicatedIdentity } from './replicated-identity'

export type ApiEntityIdentity = ReplicatedIdentity

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
  externalId?: string
  body: SyncBodyMap[R]
  operationId: string
  revision?: number
}

type DeleteOperation = {
  [R in Exclude<SyncResource, 'profile' | 'preferences' | 'academic-config'>]: {
    method: 'DELETE'
    resource: R
    entityId: string
    externalId?: string
    operationId: string
    revision?: number
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
  cloudRevision?: number
  createdAt: string
}

/** Serializable aggregate envelope shared by persistence and synchronization. */
export interface AggregateSnapshot<T> {
  id: string
  data: T
  revision?: number
  createdAt?: string
  updatedAt?: string
}
