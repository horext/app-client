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
]
