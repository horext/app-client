import type { DBSchema } from 'idb'
import type {
  IFavoriteSchedule,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'
import type { IActivity } from '#shared/domain/types/event'
import type { IProfile } from '#shared/domain/types/profile'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IGenerationRecord } from '#shared/domain/types/generation-record'
import type { ISubjectSchedules } from '#shared/domain/types/subject'

export const enum StoresDB {
  SCHEDULES = 'schedules',
  ACTIVITIES = 'activities',
  FAVORITES = 'favorites',
  PROFILE = 'profile',
  PREFERENCES = 'preferences',
  ACADEMIC_CONFIG = 'academic-config',
  GENERATIONS = 'generations',
  SUBJECTS = 'subjects',
}

export type ReplicableSchemas = {
  [StoresDB.SCHEDULES]: {
    key: [string, IScheduleGenerate['id']]
    value: IScheduleGenerate
    indexes: { createdBy: string; scheduleSubjectKey: [string, string] }
  }
  [StoresDB.ACTIVITIES]: {
    key: [string, IActivity['id']]
    value: IActivity
    indexes: { createdBy: string }
  }
  [StoresDB.FAVORITES]: {
    key: [string, IFavoriteSchedule['id']]
    value: IFavoriteSchedule
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
    key: [string, IGenerationRecord['id']]
    value: IGenerationRecord
    indexes: { createdBy: string }
  }
  [StoresDB.SUBJECTS]: {
    key: [string, ISubjectSchedules['id']]
    value: ISubjectSchedules
    indexes: { createdBy: string }
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
