import { describe, expect, it } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { SaveSyncOperationFactoryImpl } from '../sync-operation-factories'
import { activityRecord } from './indexed-db-test-fixtures'

describe('SaveSyncOperationFactoryImpl', () => {
  it('Given a snapshot, when create and update commands are built, then identity and revision are preserved', () => {
    const snapshot = { ...activityRecord(), revision: 4 }
    const factory = new SaveSyncOperationFactoryImpl(SyncResource.ACTIVITIES)
    expect(factory.create(snapshot)).toMatchObject({
      operation: SyncOperation.CREATE,
      entityId: snapshot.id,
      revision: 4,
    })
    expect(factory.update(snapshot)).toMatchObject({
      operation: SyncOperation.UPDATE,
      entityId: snapshot.id,
      revision: 4,
    })
  })
})
