import { openDB, type IDBPDatabase } from 'idb'

import { schemaMigrations } from '../../migrations/schema'
import type { HorextDB } from './schema'

export type DbFactory = () => Promise<IDBPDatabase<HorextDB>>

export function createDbFactory(
  dbName: string,
  schemaVersion: number,
): DbFactory {
  let db: Promise<IDBPDatabase<HorextDB>> | undefined
  return () =>
    (db ??= openDB<HorextDB>(dbName, schemaVersion, {
      upgrade(database, oldVersion, _newVersion, transaction) {
        for (const migration of schemaMigrations) {
          if (oldVersion < migration.version)
            migration.up(database, transaction)
        }
      },
    }))
}
