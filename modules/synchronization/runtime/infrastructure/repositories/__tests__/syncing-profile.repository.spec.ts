import { describe, expect, it, vi } from 'vitest'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { SyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingProfileRepository } from '../syncing-profile.repository'
import { profile } from './repository-test-fixtures'
import { ProfilePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingProfileRepository', () => {
  it('Given profile storage and an outbox, when reads and writes run, then reads stay local and writes use the outbox', async () => {
    const entity = profile()
    const local: IProfileRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const outbox: SyncOutbox<SyncResource.PROFILE> = {
      create: vi
        .fn()
        .mockResolvedValue(ProfilePersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(ProfilePersistenceMapper.toRecord(entity)),
    }
    const repository = new SyncingProfileRepository(local, outbox)
    await repository.get('user-1')
    await repository.create('user-1', entity)
    await repository.update('user-1', entity)
    expect(local.get).toHaveBeenCalledWith('user-1')
    expect(outbox.create).toHaveBeenCalledWith(
      'user-1',
      ProfilePersistenceMapper.toCreateRecord(entity),
    )
    expect(outbox.update).toHaveBeenCalledWith(
      'user-1',
      ProfilePersistenceMapper.toRecord(entity),
    )
  })
})
