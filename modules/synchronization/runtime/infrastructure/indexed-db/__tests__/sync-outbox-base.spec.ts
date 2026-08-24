import { describe, expect, it } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { BaseSyncOutbox } from '../sync-outbox-base'
import { SaveSyncOperationFactoryImpl } from '../sync-operation-factories'
import { activityRecord, testDatabase } from './indexed-db-test-fixtures'

describe('BaseSyncOutbox', () => {
  it('Given local create and update requests, when they are persisted, then records and ordered commands share one transaction', async () => {
    const database = testDatabase('base-outbox')
    const outbox = new BaseSyncOutbox(
      database.factory,
      SyncResource.ACTIVITIES,
      new SaveSyncOperationFactoryImpl(SyncResource.ACTIVITIES),
    )
    const activity = activityRecord()
    await outbox.create('user-1', activity)
    await outbox.update('user-1', {
      ...activity,
      title: 'Updated',
      revision: 2,
    })
    const db = await database.factory()
    const operations = (await db.getAll(StoresDB.OUTBOX)).sort(
      (left, right) => left.sequence - right.sequence,
    )
    expect(
      operations.map(({ operation, sequence }) => ({ operation, sequence })),
    ).toEqual([
      { operation: SyncOperation.CREATE, sequence: 1 },
      { operation: SyncOperation.UPDATE, sequence: 2 },
    ])
    expect(
      await db.get(StoresDB.ACTIVITIES, ['user-1', activity.id]),
    ).toMatchObject({ title: 'Updated', localSequence: 2 })
    await database.cleanup()
  })
})
