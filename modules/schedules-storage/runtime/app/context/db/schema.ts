import type { DBSchema } from 'idb'
import type {
  IScheduleFavorite,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { IActivity } from '#shared/domain/types/event'
import type { IProfile } from '#shared/domain/types/profile'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { IPlannedSubject } from '#shared/domain/types/subject'

export const enum StoresDB {
  SCHEDULES = 'schedules',
  ACTIVITIES = 'activities',
  FAVORITES = 'favorites',
  PROFILE = 'profile',
  PREFERENCES = 'preferences',
  ACADEMIC_CONFIG = 'academic-config',
  GENERATIONS = 'generations',
  SUBJECTS = 'subjects',
  OUTBOX = 'outbox',
  CONFLICTS = 'conflicts',
  SYNC_STATE = 'sync-state',
}

export type Syncable<T extends object> = T & {
  createdBy: string
  updatedBy: string
  revision?: number
  syncedAt?: string
  localSequence?: number
}

export type ReplicableSchemas = {
  [StoresDB.SCHEDULES]: {
    key: [string, IGeneratedSchedule['id']]
    value: IGeneratedSchedule
    indexes: { createdBy: string; scheduleSubjectKey: [string, string] }
  }
  [StoresDB.ACTIVITIES]: {
    key: [string, IActivity['id']]
    value: IActivity
    indexes: { createdBy: string }
  }
  [StoresDB.FAVORITES]: {
    key: [string, IScheduleFavorite['id']]
    value: IScheduleFavorite
    indexes: { createdBy: string }
  }
  [StoresDB.PROFILE]: {
    key: [string, IProfile['id']]
    value: IProfile
    indexes: { createdBy: string }
  }
  [StoresDB.PREFERENCES]: {
    key: [string, IPreferences['id']]
    value: IPreferences
    indexes: { createdBy: string }
  }
  [StoresDB.ACADEMIC_CONFIG]: {
    key: [string, IAcademicConfig['id']]
    value: IAcademicConfig
    indexes: { createdBy: string }
  }
  [StoresDB.GENERATIONS]: {
    key: [string, IScheduleGeneration['id']]
    value: IScheduleGeneration
    indexes: { createdBy: string }
  }
  [StoresDB.SUBJECTS]: {
    key: [string, IPlannedSubject['id']]
    value: IPlannedSubject
    indexes: { createdBy: string }
  }
  [StoresDB.OUTBOX]: {
    key: string
    value: Record<string, unknown>
    indexes: Record<never, never>
  }
  [StoresDB.CONFLICTS]: {
    key: string
    value: Record<string, unknown>
    indexes: Record<never, never>
  }
  [StoresDB.SYNC_STATE]: {
    key: string
    value: Record<string, unknown>
    indexes: Record<never, never>
  }
}

export type HorextDB = DBSchema | ReplicableSchemas

export type ReplicableStore =
  | StoresDB.ACADEMIC_CONFIG
  | StoresDB.ACTIVITIES
  | StoresDB.FAVORITES
  | StoresDB.GENERATIONS
  | StoresDB.PREFERENCES
  | StoresDB.PROFILE
  | StoresDB.SCHEDULES
  | StoresDB.SUBJECTS

export type ReplicableStoreValue<S extends ReplicableStore = ReplicableStore> =
  ReplicableSchemas[S]['value']
export type ReplicableStoreKey<S extends ReplicableStore = ReplicableStore> =
  ReplicableSchemas[S]['key']
