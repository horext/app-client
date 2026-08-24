import { describe, expect, it, vi } from 'vitest'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingGenerationsRepository } from '../syncing-generations.repository'
import { generation } from './repository-test-fixtures'
import { ScheduleGenerationPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingGenerationsRepository', () => {
  it('Given generation storage and an outbox, when CRUD runs, then reads stay local and mutations use the outbox', async () => {
    const entity = generation()
    const local: IGenerationRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const outbox: CollectionSyncOutbox<SyncResource.GENERATIONS> = {
      create: vi
        .fn()
        .mockResolvedValue(
          ScheduleGenerationPersistenceMapper.toRecord(entity),
        ),
      update: vi
        .fn()
        .mockResolvedValue(
          ScheduleGenerationPersistenceMapper.toRecord(entity),
        ),
      delete: vi.fn(),
    }
    const repository = new SyncingGenerationsRepository(local, outbox)
    await repository.findAll('user-1')
    await repository.findById('user-1', entity.id)
    await repository.create('user-1', entity)
    await repository.update('user-1', entity)
    await repository.delete('user-1', entity.id)
    expect(local.findAll).toHaveBeenCalledOnce()
    expect(local.findById).toHaveBeenCalledOnce()
    expect(outbox.create).toHaveBeenCalledOnce()
    expect(outbox.update).toHaveBeenCalledOnce()
    expect(outbox.delete).toHaveBeenCalledOnce()
  })
})
