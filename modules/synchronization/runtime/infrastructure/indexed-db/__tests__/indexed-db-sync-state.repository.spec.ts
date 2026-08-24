import { makeUUID } from '~~/shared/domain/types/ids'
import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import {
  createDbFactory,
  StoresDB,
} from '../../../../../schedules-storage/runtime/app/context/db'
import { IndexedDbSyncStateRepository } from '../indexed-db-sync-state.repository'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { SyncConflictRecord } from '~~/modules/synchronization/runtime/contracts'
import { schemaMigrations } from '../../../../../schedules-storage/runtime/app/migrations/schema'
import { activityRecord, testDatabase } from './indexed-db-test-fixtures'

const factory = createDbFactory(
  `sync-state-${makeUUID()}`,
  2,
  (database, oldVersion, _newVersion, transaction) => {
    for (const migration of schemaMigrations)
      if (oldVersion < migration.version) migration.up(database, transaction)
  },
)
const state = new IndexedDbSyncStateRepository(factory)

describe('IndexedDbSyncStateRepository', () => {
  it('writes the confirmed cloud revision and sync timestamp to the local record', async () => {
    const database = testDatabase('sync-confirm')
    const repository = new IndexedDbSyncStateRepository(database.factory)
    const activity = activityRecord('user-1')
    const db = await database.factory()
    await db.put(StoresDB.ACTIVITIES, activity)
    await repository.confirm(
      {
        operation: SyncOperation.UPDATE,
        resource: SyncResource.ACTIVITIES,
        entityId: activity.id,
        operationId: 'operation-1',
        revision: 1,
        body: activity,
        userId: 'user-1',
        key: 'pending-1',
        createdAt: activity.updatedAt,
        sequence: 1,
      },
      activity.updatedAt,
      2,
    )
    const confirmed = await db.get(StoresDB.ACTIVITIES, ['user-1', activity.id])
    expect(confirmed).toMatchObject({ revision: 2 })
    expect(confirmed?.syncedAt).toEqual(expect.any(String))
    db.close()
    await database.cleanup()
  })

  it('Given cursor and conflict state for multiple users, when state is read, then each user remains isolated', async () => {
    await state.saveCursor('user-a', 'cursor-a')
    await state.saveCursor('user-b', 'cursor-b')
    await state.saveConflict(conflict('user-a', 'conflict-a'))
    await state.saveConflict(conflict('user-b', 'conflict-b'))

    await expect(state.cursor('user-a')).resolves.toBe('cursor-a')
    await expect(state.cursor('user-b')).resolves.toBe('cursor-b')
    await expect(state.conflicts('user-a')).resolves.toEqual([
      expect.objectContaining({ key: 'conflict-a' }),
    ])
    await expect(
      state.conflict('user-a', 'conflict-b'),
    ).resolves.toBeUndefined()
    const database = await factory()
    database.close()
  })
})

function conflict(userId: string, key: string): SyncConflictRecord {
  return {
    key,
    operation: {
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: 'activity-1',
      operationId: key,
      revision: 1,
      userId,
      key,
      createdAt: new Date().toISOString(),
      sequence: 1,
    },
    createdAt: new Date().toISOString(),
  }
}
