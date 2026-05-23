import type { IDBPDatabase, IDBPTransaction, StoreNames } from 'idb'
import { StoresDB, type HorextDB } from '../context/db'

export type SchemaMigration = {
  version: number
  up: (
    db: IDBPDatabase<HorextDB>,
    tx: IDBPTransaction<HorextDB, StoreNames<HorextDB>[], 'versionchange'>,
  ) => void
}

export const schemaMigrations: SchemaMigration[] = [
  {
    version: 1,
    up(db) {
      db.createObjectStore(StoresDB.MIGRATIONS, { keyPath: 'id' })
    },
  },
  {
    version: 2,
    up(db) {
      db.createObjectStore(StoresDB.SCHEDULES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.FAVORITES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.GENERATIONS, { keyPath: 'id' })
    },
  },
  {
    version: 3,
    up(db) {
      db.createObjectStore(StoresDB.ACTIVITIES, { keyPath: 'id' })
    },
  },
  {
    version: 4,
    up(db) {
      db.createObjectStore(StoresDB.PROFILE, { keyPath: 'id' })
    },
  },
  {
    version: 5,
    up(db) {
      db.createObjectStore(StoresDB.PREFERENCES, { keyPath: 'id' })
    },
  },
  {
    version: 6,
    up(db) {
      db.createObjectStore(StoresDB.ACADEMIC_CONFIG, { keyPath: 'id' })
    },
  },
  {
    version: 7,
    up(db) {
      db.createObjectStore(StoresDB.SUBJECTS, { keyPath: 'id' })
    },
  },
  {
    version: 8,
    up(_db, tx) {
      tx.objectStore(StoresDB.SCHEDULES).createIndex(
        'scheduleSubjectKey',
        'scheduleSubjectKey',
      )
    },
  },
]
