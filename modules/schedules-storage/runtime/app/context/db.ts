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

export interface HorextDB extends DBSchema {
  schedules: {
    key: IScheduleGenerate['id']
    value: IScheduleGenerate
  }
  migrations: {
    key: string
    value: { id: string; appliedAt: string }
  }
  activities: {
    key: IActivity['id']
    value: IActivity
  }
  favorites: {
    key: UUID
    value: { id: UUID }
  }
  profile: {
    key: IUserProfile['id']
    value: IUserProfile
  }
  preferences: {
    key: IUserPreferences['id']
    value: IUserPreferences
  }
  'academic-config': {
    key: IUserAcademicConfig['id']
    value: IUserAcademicConfig
  }
  generations: {
    key: IGenerationRecord['id']
    value: IGenerationRecord
  }
  subjects: {
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
      upgrade(db, oldVersion) {
        for (const migration of schemaMigrations) {
          if (oldVersion < migration.version) {
            migration.up(db)
          }
        }
      },
    }))
}
