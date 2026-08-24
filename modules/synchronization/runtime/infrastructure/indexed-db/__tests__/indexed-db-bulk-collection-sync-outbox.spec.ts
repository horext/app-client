import { describe, expect, it } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { IndexedDbBulkCollectionSyncOutbox } from '../indexed-db-bulk-collection-sync-outbox'
import { CollectionSyncOperationFactoryImpl } from '../collection-sync-operation-factory'
import { scheduleRecord, testDatabase } from './indexed-db-test-fixtures'

describe('IndexedDbBulkCollectionSyncOutbox', () => {
  it('Given multiple schedules, when bulk create, update, and delete run, then every mutation is ordered and persisted', async () => {
    const database = testDatabase('bulk-outbox')
    const outbox = new IndexedDbBulkCollectionSyncOutbox(
      database.factory,
      SyncResource.SCHEDULES,
      new CollectionSyncOperationFactoryImpl(SyncResource.SCHEDULES),
    )
    const first = scheduleRecord()
    const second = scheduleRecord()
    await outbox.createAll('user-1', [first, second])
    await outbox.updateAll('user-1', [{ ...first, crossings: 2 }])
    await outbox.deleteAll('user-1', [first.id, second.id])
    await outbox.deleteAll('user-1', [])
    const db = await database.factory()
    const operations = (await db.getAll(StoresDB.OUTBOX)).sort(
      (left, right) => left.sequence - right.sequence,
    )
    expect(operations.map(({ operation }) => operation)).toEqual([
      SyncOperation.CREATE,
      SyncOperation.CREATE,
      SyncOperation.UPDATE,
      SyncOperation.DELETE,
      SyncOperation.DELETE,
    ])
    expect(await db.getAll(StoresDB.SCHEDULES)).toEqual([])
    await database.cleanup()
  })
})
