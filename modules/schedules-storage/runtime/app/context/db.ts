import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { InjectionKey } from 'vue'
import type { IScheduleGenerate } from '../../shared/interfaces/schedule'
import type { IActivity } from '../../shared/interfaces/event'
import type { IUserProfile } from '../../shared/interfaces/profile'
import type { IUserAcademicConfig } from '../../shared/interfaces/academic-config'
import type { IUserPreferences } from '../../shared/interfaces/preferences'
import type { IGenerationRecord } from '../../shared/interfaces/generation-record'
import type { ISubjectSchedules } from '../../shared/interfaces/subject'
import { schemaMigrations } from '../migrations/schema'
import type { UUID } from 'crypto'

export const enum StoresDB {
  SCHEDULES = 'schedules',
  MIGRATIONS = 'migrations',
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
    key: IScheduleGenerate['id']
    value: IScheduleGenerate
    indexes: { scheduleSubjectKey: string }
  }
  [StoresDB.MIGRATIONS]: {
    key: string
    value: { id: string; appliedAt: string; error?: string }
  }
  [StoresDB.ACTIVITIES]: {
    key: IActivity['id']
    value: IActivity
  }
  [StoresDB.FAVORITES]: {
    key: UUID
    value: { id: UUID }
  }
  [StoresDB.PROFILE]: {
    key: IUserProfile['id']
    value: IUserProfile
  }
  [StoresDB.PREFERENCES]: {
    key: IUserPreferences['id']
    value: IUserPreferences
  }
  [StoresDB.ACADEMIC_CONFIG]: {
    key: IUserAcademicConfig['id']
    value: IUserAcademicConfig
  }
  [StoresDB.GENERATIONS]: {
    key: IGenerationRecord['id']
    value: IGenerationRecord
  }
  [StoresDB.SUBJECTS]: {
    key: ISubjectSchedules['id']
    value: ISubjectSchedules
  }
}
export type DbFactory = () => Promise<IDBPDatabase<HorextDB>>

export const SCHEDULES_DB_KEY: InjectionKey<DbFactory> = Symbol('HorextDB')

export function createDbFactory(dbName: string, dbVersion: number): DbFactory {
  let _db: Promise<IDBPDatabase<HorextDB>> | undefined
  return () =>
    (_db ??= openDB<HorextDB>(dbName, dbVersion, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        for (const migration of schemaMigrations) {
          if (oldVersion < migration.version) {
            migration.up(db, transaction)
          }
        }
      },
    }))
}
