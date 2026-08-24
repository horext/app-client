import { describe, expect, it, vi } from 'vitest'
import type { ISchedulesFavoritesRepository } from '#shared/application/repositories/schedules.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingFavoritesRepository } from '../syncing-favorites.repository'
import { favorite } from './repository-test-fixtures'
import { ScheduleFavoritePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingFavoritesRepository', () => {
  it('Given favorite storage and an outbox, when CRUD runs, then updates are represented as idempotent creates', async () => {
    const entity = favorite()
    const local: ISchedulesFavoritesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(entity),
      findByScheduleId: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      delete: vi.fn(),
    }
    const outbox: CollectionSyncOutbox<SyncResource.FAVORITES> = {
      create: vi
        .fn()
        .mockResolvedValue(ScheduleFavoritePersistenceMapper.toRecord(entity)),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const repository = new SyncingFavoritesRepository(local, outbox)
    const data = ScheduleFavoritePersistenceMapper.toRecord(entity)
    const entityId = data.id
    await repository.findAll('user-1')
    await repository.findById('user-1', entityId)
    await repository.update('user-1', entity)
    await repository.delete('user-1', entityId)
    expect(outbox.create).toHaveBeenCalledWith(
      'user-1',
      ScheduleFavoritePersistenceMapper.toCreateRecord(entity),
    )
    expect(outbox.update).not.toHaveBeenCalled()
    expect(outbox.delete).toHaveBeenCalledOnce()
  })
})
