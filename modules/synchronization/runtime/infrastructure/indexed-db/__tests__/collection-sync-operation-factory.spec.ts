import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncOperationFactoryImpl } from '../collection-sync-operation-factory'

describe('CollectionSyncOperationFactoryImpl', () => {
  it('Given an entity identity and revision, when deletion is built, then the command carries both', () => {
    const id = makeUUID()
    const operation = new CollectionSyncOperationFactoryImpl(
      SyncResource.ACTIVITIES,
    ).delete(id, 5)
    expect(operation).toMatchObject({
      operation: SyncOperation.DELETE,
      resource: SyncResource.ACTIVITIES,
      entityId: id,
      revision: 5,
    })
  })
})
