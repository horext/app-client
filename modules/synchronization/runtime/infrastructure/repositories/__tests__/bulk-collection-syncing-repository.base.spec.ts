import { describe, expect, it, vi } from 'vitest'
import { GeneratedSchedule, type BaseGeneratedSchedule } from '#shared/domain'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { BulkCollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { BulkCollectionSyncingRepository } from '../bulk-collection-syncing-repository.base'
import { schedule } from './repository-test-fixtures'
import { GeneratedSchedulePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

class ScheduleBulkRepository extends BulkCollectionSyncingRepository<
  GeneratedSchedule,
  BaseGeneratedSchedule,
  SyncResource.SCHEDULES
> {}

describe('BulkCollectionSyncingRepository', () => {
  it('Given a bulk outbox, when bulk mutations run, then snapshots are delegated and restored', async () => {
    const entity = schedule()
    const outbox: BulkCollectionSyncOutbox<SyncResource.SCHEDULES> = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      createAll: vi
        .fn()
        .mockResolvedValue([
          GeneratedSchedulePersistenceMapper.toRecord(entity),
        ]),
      updateAll: vi
        .fn()
        .mockResolvedValue([
          GeneratedSchedulePersistenceMapper.toRecord(entity),
        ]),
      deleteAll: vi.fn(),
    }
    const repository = new ScheduleBulkRepository(
      outbox,
      GeneratedSchedule.reconstitute,
      GeneratedSchedulePersistenceMapper.toCreateRecord,
      GeneratedSchedulePersistenceMapper.toRecord,
    )
    await expect(repository.createAll('user-1', [entity])).resolves.toEqual([
      entity,
    ])
    await expect(repository.updateAll('user-1', [entity])).resolves.toEqual([
      entity,
    ])
    await repository.deleteAll('user-1', [entity.id])
    expect(outbox.deleteAll).toHaveBeenCalledWith('user-1', [entity.id])
  })
})
