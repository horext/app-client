import { describe, expect, it, vi } from 'vitest'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingActivitiesRepository } from '../syncing-activities.repository'
import { activity } from './repository-test-fixtures'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingActivitiesRepository', () => {
  it('Given activity storage and an outbox, when CRUD runs, then reads stay local and mutations use the outbox', async () => {
    const entity = activity()
    const local: IActivitiesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const outbox: CollectionSyncOutbox<SyncResource.ACTIVITIES> = {
      create: vi
        .fn()
        .mockResolvedValue(ActivityPersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(ActivityPersistenceMapper.toRecord(entity)),
      delete: vi.fn(),
    }
    const repository = new SyncingActivitiesRepository(local, outbox)
    await repository.findAll('user-1')
    await repository.findById('user-1', entity.id)
    await repository.create('user-1', entity)
    await repository.update('user-1', entity)
    await repository.delete('user-1', entity.id)
    expect(local.findAll).toHaveBeenCalledOnce()
    expect(local.findById).toHaveBeenCalledOnce()
    expect(outbox.create).toHaveBeenCalledOnce()
    expect(outbox.update).toHaveBeenCalledOnce()
    expect(outbox.delete).toHaveBeenCalledWith('user-1', entity.id)
  })
})
