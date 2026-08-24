import { describe, expect, it, vi } from 'vitest'
import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { BulkCollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingSchedulesRepository } from '../syncing-schedules.repository'
import { schedule } from './repository-test-fixtures'
import { GeneratedSchedulePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingSchedulesRepository', () => {
  it('Given schedule storage and a bulk outbox, when all repository paths run, then reads stay local and mutations use the outbox', async () => {
    const entity = schedule()
    const local: ISchedulesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findBy: vi.fn().mockResolvedValue(entity),
      getEntries: vi.fn().mockResolvedValue([entity]),
      getByKey: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      createAll: vi.fn(),
      update: vi.fn(),
      deleteEntry: vi.fn(),
      deleteEntries: vi.fn(),
    }
    const outbox: BulkCollectionSyncOutbox<SyncResource.SCHEDULES> = {
      create: vi
        .fn()
        .mockResolvedValue(GeneratedSchedulePersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(GeneratedSchedulePersistenceMapper.toRecord(entity)),
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
    const repository = new SyncingSchedulesRepository(local, outbox)
    await repository.findAll('user-1')
    await repository.findBy('user-1', entity.id)
    await repository.getEntries('user-1', [entity.id])
    await repository.getByKey('user-1', 'key')
    await repository.create('user-1', entity)
    await repository.createAll('user-1', [entity])
    await repository.update('user-1', entity)
    await repository.updateAll('user-1', [entity])
    await repository.deleteEntry('user-1', entity.id)
    await repository.deleteEntries('user-1', [entity.id])
    expect(local.findAll).toHaveBeenCalledOnce()
    expect(local.findBy).toHaveBeenCalledOnce()
    expect(local.getEntries).toHaveBeenCalledOnce()
    expect(local.getByKey).toHaveBeenCalledOnce()
    expect(outbox.createAll).toHaveBeenCalledOnce()
    expect(outbox.updateAll).toHaveBeenCalledOnce()
    expect(outbox.delete).toHaveBeenCalledOnce()
    expect(outbox.deleteAll).toHaveBeenCalledOnce()
  })
})
