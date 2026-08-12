import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
  type OpenDBCallbacks,
} from 'idb'

import type { HorextDB } from './schema'

export type DbFactory<DB extends DBSchema = HorextDB> = () => Promise<
  IDBPDatabase<DB>
>

export function createDbFactory<DB extends DBSchema = HorextDB>(
  dbName: string,
  schemaVersion: number,
  upgrade: OpenDBCallbacks<DB>['upgrade'],
): DbFactory<DB> {
  let db: Promise<IDBPDatabase<DB>> | undefined
  return () =>
    (db ??= openDB<DB>(dbName, schemaVersion, {
      upgrade,
    }))
}
