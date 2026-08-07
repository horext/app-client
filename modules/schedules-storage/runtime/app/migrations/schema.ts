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
    up(db, tx) {
      db.createObjectStore(StoresDB.SCHEDULES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.FAVORITES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.GENERATIONS, { keyPath: 'id' })
      db.createObjectStore(StoresDB.ACTIVITIES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.PROFILE, { keyPath: 'id' })
      db.createObjectStore(StoresDB.PREFERENCES, { keyPath: 'id' })
      db.createObjectStore(StoresDB.ACADEMIC_CONFIG, { keyPath: 'id' })
      db.createObjectStore(StoresDB.SUBJECTS, { keyPath: 'id' })
      tx.objectStore(StoresDB.SCHEDULES).createIndex(
        'scheduleSubjectKey',
        'scheduleSubjectKey',
      )
    },
  },
]
