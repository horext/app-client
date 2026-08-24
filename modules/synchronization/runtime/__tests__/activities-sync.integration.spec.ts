import { makeUUID } from '~~/shared/domain/types/ids'
import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { deleteDB } from 'idb'
import { ActivitiesService } from '#shared/application/services/activities.service'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import {
  createDbFactory,
  StoresDB,
} from '../../../schedules-storage/runtime/app/context/db'
import { IndexedDbAggregatePersistence } from '../../../schedules-storage/runtime/app/persistence/indexed-db-aggregate-persistence'
import { IndexedDBActivitiesRepository } from '../../../schedules-storage/runtime/app/repositories/indexed-db-activities.repository'
import { createIndexedDbSyncOutboxes } from '../infrastructure/indexed-db/create-sync-outboxes'
import { SyncingActivitiesRepository } from '../infrastructure/repositories/syncing-activities.repository'
import { schemaMigrations } from '../../../schedules-storage/runtime/app/migrations/schema'
import { ActivityPersistenceMapper } from '../../../schedules-storage/runtime/app/mappers'

const databases: string[] = []

afterEach(async () => {
  for (const name of databases.splice(0)) await deleteDB(name)
})

describe('activities synchronization integration', () => {
  it('Given an activity service backed by a syncing repository, when an activity is saved, then its record and outbox command persist atomically', async () => {
    const name = `activities-sync-${makeUUID()}`
    databases.push(name)
    const dbFactory = createDbFactory(
      name,
      2,
      (database, oldVersion, _newVersion, transaction) => {
        for (const migration of schemaMigrations)
          if (oldVersion < migration.version)
            migration.up(database, transaction)
      },
    )
    const persistence = new IndexedDbAggregatePersistence(dbFactory)
    const local = new IndexedDBActivitiesRepository(persistence)
    const repository = new SyncingActivitiesRepository(
      local,
      createIndexedDbSyncOutboxes(dbFactory).activities,
    )
    const service = new ActivitiesService(repository)

    const activity = await service.create('user-1', {
      title: 'Study',
      color: '#ffffff',
      allowOverlap: false,
      sessions: [{ day: 1, startTime: '09:00', endTime: '10:00' }],
    })

    const stored = await local.findById('user-1', activity.id)
    const db = await dbFactory()
    const operations = await db.getAll(StoresDB.OUTBOX)

    expect(stored && ActivityPersistenceMapper.toRecord(stored)).toEqual(
      ActivityPersistenceMapper.toRecord(activity),
    )
    expect(operations).toEqual([
      expect.objectContaining({
        userId: 'user-1',
        resource: SyncResource.ACTIVITIES,
        operation: SyncOperation.CREATE,
        entityId: activity.id,
        sequence: 1,
        body: expect.objectContaining({ id: activity.id, title: 'Study' }),
      }),
    ])

    db.close()
  })
})
