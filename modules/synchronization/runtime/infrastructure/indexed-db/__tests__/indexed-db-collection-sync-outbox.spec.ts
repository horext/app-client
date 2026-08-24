import { describe, expect, it } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { IndexedDbCollectionSyncOutbox } from '../indexed-db-collection-sync-outbox'
import { CollectionSyncOperationFactoryImpl } from '../collection-sync-operation-factory'
import { activityRecord, testDatabase } from './indexed-db-test-fixtures'

describe('IndexedDbCollectionSyncOutbox', () => {
  it('Given a persisted collection record, when it is deleted, then the record is removed and a revisioned command is queued', async () => {
    const database = testDatabase('collection-outbox')
    const outbox = new IndexedDbCollectionSyncOutbox(
      database.factory,
      SyncResource.ACTIVITIES,
      new CollectionSyncOperationFactoryImpl(SyncResource.ACTIVITIES),
    )
    const activity = { ...activityRecord(), revision: 6 }
    const db = await database.factory()
    await db.put(StoresDB.ACTIVITIES, activity)
    await outbox.delete('user-1', activity.id)
    expect(
      await db.get(StoresDB.ACTIVITIES, ['user-1', activity.id]),
    ).toBeUndefined()
    expect(await db.getAll(StoresDB.OUTBOX)).toContainEqual(
      expect.objectContaining({ operation: SyncOperation.DELETE, revision: 6 }),
    )
    await database.cleanup()
  })
})
