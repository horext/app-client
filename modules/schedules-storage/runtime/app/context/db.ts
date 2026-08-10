import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
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
import { schemaMigrations } from '../migrations/schema'

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
export interface HorextDB extends DBSchema {
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
/** Stores containing domain aggregates that can be replicated with the cloud. */
export type ReplicableStore =
  | StoresDB.ACADEMIC_CONFIG
  | StoresDB.ACTIVITIES
  | StoresDB.FAVORITES
  | StoresDB.GENERATIONS
  | StoresDB.PREFERENCES
  | StoresDB.PROFILE
  | StoresDB.SCHEDULES
  | StoresDB.SUBJECTS

export type ReplicableSchemas = Pick<HorextDB, ReplicableStore>
export type ReplicableStoreValue<S extends ReplicableStore> =
  HorextDB[S]['value']

export type DbFactory = () => Promise<IDBPDatabase<HorextDB>>

export function createDbFactory(
  dbName: string,
  schemaVersion: number,
): DbFactory {
  let _db: Promise<IDBPDatabase<HorextDB>> | undefined
  return () =>
    (_db ??= openDB<HorextDB>(dbName, schemaVersion, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        for (const migration of schemaMigrations) {
          if (oldVersion < migration.version) {
            migration.up(db, transaction)
          }
        }
      },
    }))
}
