import { describe, expect, it, vi } from 'vitest'
import { Activity, type BaseActivity } from '#shared/domain'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { SyncOutbox } from '../../indexed-db/sync-outbox-base'
import { BaseSyncingRepository } from '../syncing-repository.base'
import { activity } from './repository-test-fixtures'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

class ActivityRepository extends BaseSyncingRepository<
  Activity,
  BaseActivity,
  SyncResource.ACTIVITIES
> {}

describe('BaseSyncingRepository', () => {
  it('Given an entity and outbox, when create and update run, then returned snapshots are restored as entities', async () => {
    const entity = activity()
    const outbox: SyncOutbox<SyncResource.ACTIVITIES> = {
      create: vi
        .fn()
        .mockResolvedValue(ActivityPersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(ActivityPersistenceMapper.toRecord(entity)),
    }
    const repository = new ActivityRepository(
      outbox,
      Activity.reconstitute,
      ActivityPersistenceMapper.toCreateRecord,
      ActivityPersistenceMapper.toRecord,
    )
    await expect(repository.create('user-1', entity)).resolves.toEqual(entity)
    await expect(repository.update('user-1', entity)).resolves.toEqual(entity)
  })
})
