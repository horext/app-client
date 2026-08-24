import { describe, expect, it } from 'vitest'
import { createIndexedDbSyncOutboxes } from '../create-sync-outboxes'
import { activityRecord, testDatabase } from './indexed-db-test-fixtures'

describe('createIndexedDbSyncOutboxes', () => {
  it('Given a database, when outboxes are composed, then every synchronization resource is writable', async () => {
    const database = testDatabase('outbox-composition')
    const outboxes = createIndexedDbSyncOutboxes(database.factory)
    const activity = activityRecord()
    await expect(
      outboxes.activities.create('user-1', activity),
    ).resolves.toMatchObject({
      id: activity.id,
      localSequence: 1,
    })
    expect(Object.keys(outboxes).sort()).toEqual([
      'academicConfig',
      'activities',
      'favorites',
      'generations',
      'preferences',
      'profile',
      'schedules',
      'subjects',
    ])
    await database.cleanup()
  })
})
