import { describe, expect, it, vi } from 'vitest'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { SyncOutbox } from '../../indexed-db/sync-outbox-base'
import { SyncingPreferencesRepository } from '../syncing-preferences.repository'
import { preferences } from './repository-test-fixtures'
import { PreferencesPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SyncingPreferencesRepository', () => {
  it('Given preferences storage and an outbox, when reads and writes run, then each path uses its proper dependency', async () => {
    const entity = preferences()
    const local: IPreferencesRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const outbox: SyncOutbox<SyncResource.PREFERENCES> = {
      create: vi
        .fn()
        .mockResolvedValue(PreferencesPersistenceMapper.toRecord(entity)),
      update: vi
        .fn()
        .mockResolvedValue(PreferencesPersistenceMapper.toRecord(entity)),
    }
    const repository = new SyncingPreferencesRepository(local, outbox)
    await repository.get('user-1')
    await repository.create('user-1', entity)
    await repository.update('user-1', entity)
    expect(local.get).toHaveBeenCalledWith('user-1')
    expect(outbox.create).toHaveBeenCalledOnce()
    expect(outbox.update).toHaveBeenCalledOnce()
  })
})
