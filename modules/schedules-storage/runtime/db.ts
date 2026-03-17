import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { InjectionKey } from 'vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { schemaMigrations } from './migrations/schema'

export interface HorextDB extends DBSchema {
    entries: {
        key: string
        value: IScheduleGenerate
    }
    meta: {
        key: 'generated:ids' | 'favorites:ids'
        value: string[]
    }
    migrations: {
        key: string
        value: { id: string; appliedAt: string }
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
