import type { IDBPDatabase } from 'idb'
import type { HorextDB } from '../db'

export type SchemaMigration = {
  version: number
  up: (db: IDBPDatabase<HorextDB>) => void
}

export const schemaMigrations: SchemaMigration[] = [
  {
    version: 1,
    up(db) {
      db.createObjectStore('migrations', { keyPath: 'id' })
    },
  },
  {
    version: 2,
    up(db) {
      db.createObjectStore('entries', { keyPath: 'id' })
      db.createObjectStore('meta')
    },
  },
]
