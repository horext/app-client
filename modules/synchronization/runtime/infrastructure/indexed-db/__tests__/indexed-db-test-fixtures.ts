import { makeUUID } from '~~/shared/domain/types/ids'
import 'fake-indexeddb/auto'
import { deleteDB } from 'idb'
import type { IActivity } from '#shared/domain/types/event'
import type { IGeneratedSchedule } from '#shared/domain/types/schedule'
import { createDbFactory } from '../../../../../schedules-storage/runtime/app/context/db'
import { schemaMigrations } from '../../../../../schedules-storage/runtime/app/migrations/schema'

export function activityRecord(userId = 'user-1'): IActivity {
  const timestamp = '2026-01-01T00:00:00.000Z'
  return {
    id: makeUUID(),
    title: 'Study',
    color: '#fff',
    allowOverlap: false,
    sessions: [{ day: 1, startTime: '09:00', endTime: '10:00' }],
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: userId,
    updatedBy: userId,
  }
}

export function scheduleRecord(userId = 'user-1'): IGeneratedSchedule {
  const timestamp = '2026-01-01T00:00:00.000Z'
  return {
    id: makeUUID(),
    scheduleSubjectKey: 'key-1',
    schedulesSubject: [],
    crossings: 0,
    events: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: userId,
    updatedBy: userId,
  }
}

export function testDatabase(prefix: string) {
  const name = `${prefix}-${makeUUID()}`
  const factory = createDbFactory(
    name,
    2,
    (database, oldVersion, _newVersion, transaction) => {
      for (const migration of schemaMigrations)
        if (oldVersion < migration.version) migration.up(database, transaction)
    },
  )
  return {
    factory,
    async cleanup() {
      const database = await factory()
      database.close()
      await deleteDB(name)
    },
  }
}
