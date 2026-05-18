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
      db.createObjectStore('schedules', { keyPath: 'id' })
      db.createObjectStore('favorites', { keyPath: 'id' })
      db.createObjectStore('generations', { keyPath: 'id' })
    },
  },
  {
    version: 3,
    up(db) {
      db.createObjectStore('activities', { keyPath: 'id' })
    },
  },
  {
    version: 4,
    up(db) {
      db.createObjectStore('profile', { keyPath: 'id' })
    },
  },
  {
    version: 5,
    up(db) {
      db.createObjectStore('preferences', { keyPath: 'id' })
    },
  },
  {
    version: 6,
    up(db) {
      db.createObjectStore('academic-config', { keyPath: 'id' })
    },
  },
]
