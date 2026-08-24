import { describe, expect, it, vi } from 'vitest'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionSyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingSubjectsRepository } from '../syncing-subjects.repository'
import { subject } from './repository-test-fixtures'
import { PlannedSubjectPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingSubjectsRepository', () => {
  it('Given subject storage and an outbox, when CRUD runs, then reads stay local and mutations use the outbox', async () => {
    const entity = subject()
    const local: ISubjectsRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const outbox: CollectionSyncOutbox<SyncResource.SUBJECTS> = {
      create: vi
        .fn()
        .mockResolvedValue(PlannedSubjectPersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(PlannedSubjectPersistenceMapper.toRecord(entity)),
      delete: vi.fn(),
    }
    const repository = new SyncingSubjectsRepository(local, outbox)
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
