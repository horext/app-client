import type { DBSchema, IDBPDatabase, IDBPTransaction, StoreNames } from 'idb'
import { StoresDB, type HorextDB } from '../context/db'

export type RunSchemaMigration<DB extends DBSchema> = (
  db: IDBPDatabase<DB>,
  tx: IDBPTransaction<DB, StoreNames<DB>[], 'versionchange'>,
) => void

export type SchemaMigration<DB extends DBSchema> = {
  version: number
  up: RunSchemaMigration<DB>
}

export const schemaMigrations: SchemaMigration<HorextDB>[] = [
  {
    version: 1,
    up(db, tx) {
      db.createObjectStore(StoresDB.SCHEDULES, { keyPath: ['createdBy', 'id'] })
      db.createObjectStore(StoresDB.FAVORITES, { keyPath: ['createdBy', 'id'] })
      db.createObjectStore(StoresDB.GENERATIONS, {
        keyPath: ['createdBy', 'id'],
      })
      db.createObjectStore(StoresDB.ACTIVITIES, {
        keyPath: ['createdBy', 'id'],
      })
      db.createObjectStore(StoresDB.PROFILE, { keyPath: ['createdBy', 'id'] })
      db.createObjectStore(StoresDB.PREFERENCES, {
        keyPath: ['createdBy', 'id'],
      })
      db.createObjectStore(StoresDB.ACADEMIC_CONFIG, {
        keyPath: ['createdBy', 'id'],
      })
      db.createObjectStore(StoresDB.SUBJECTS, { keyPath: ['createdBy', 'id'] })
      tx.objectStore(StoresDB.SCHEDULES).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.FAVORITES).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.GENERATIONS).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.ACTIVITIES).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.PROFILE).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.PREFERENCES).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.ACADEMIC_CONFIG).createIndex(
        'createdBy',
        'createdBy',
      )
      tx.objectStore(StoresDB.SUBJECTS).createIndex('createdBy', 'createdBy')
      tx.objectStore(StoresDB.SCHEDULES).createIndex('scheduleSubjectKey', [
        'createdBy',
        'scheduleSubjectKey',
      ])
    },
  },
  {
    version: 2,
    up(db) {
      const store = db.createObjectStore(StoresDB.LOCAL_HOURLY_LOAD, {
        keyPath: 'userId',
      })
      store.createIndex('userId', 'userId', { unique: true })
    },
  },
]
