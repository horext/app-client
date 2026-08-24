import { describe, expect, it, vi } from 'vitest'
import { Activity, type BaseActivity } from '#shared/domain'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { CollectionSyncingRepository } from '../collection-syncing-repository.base'
import { activity } from './repository-test-fixtures'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

class ActivityCollectionRepository extends CollectionSyncingRepository<
  Activity,
  BaseActivity,
  SyncResource.ACTIVITIES
> {}

describe('CollectionSyncingRepository', () => {
  it('Given a collection outbox, when an entity is deleted, then deletion is delegated with user identity', async () => {
    const entity = activity()
    const outbox: CollectionSyncOutbox<SyncResource.ACTIVITIES> = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    await new ActivityCollectionRepository(
      outbox,
      Activity.reconstitute,
      ActivityPersistenceMapper.toCreateRecord,
      ActivityPersistenceMapper.toRecord,
    ).delete('user-1', entity.id)
    expect(outbox.delete).toHaveBeenCalledWith('user-1', entity.id)
  })
})
