import { describe, expect, it, vi } from 'vitest'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { SyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingAcademicConfigRepository } from '../syncing-academic-config.repository'
import { academicConfig } from './repository-test-fixtures'
import { AcademicConfigPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingAcademicConfigRepository', () => {
  it('Given academic config storage and an outbox, when reads and writes run, then each path uses its proper dependency', async () => {
    const entity = academicConfig()
    const local: IAcademicConfigRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const outbox: SyncOutbox<SyncResource.ACADEMIC_CONFIG> = {
      create: vi
        .fn()
        .mockResolvedValue(AcademicConfigPersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(AcademicConfigPersistenceMapper.toRecord(entity)),
    }
    const repository = new SyncingAcademicConfigRepository(local, outbox)
    await repository.get('user-1')
    await repository.create('user-1', entity)
    await repository.update('user-1', entity)
    expect(local.get).toHaveBeenCalledWith('user-1')
    expect(outbox.create).toHaveBeenCalledOnce()
    expect(outbox.update).toHaveBeenCalledOnce()
  })
})
