import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { InjectionKey } from 'vue'
import type { IScheduleGenerate, UUID } from '~/interfaces/schedule'
import type { IEvent } from '~/interfaces/event'
import { schemaMigrations } from './migrations/schema'

export interface HorextDB extends DBSchema {
    schedules: {
        key: string
        value: IScheduleGenerate
    }
    migrations: {
        key: string
        value: { id: string; appliedAt: string }
    }
    activities: {
        key: string
        value: IEvent & { id: string }
    }
    generated: {
        key: string
        value: { id: UUID }
    }
    favorites: {
        key: string
        value: { id: UUID }
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
