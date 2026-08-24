import { describe, expect, it, vi } from 'vitest'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { preferences } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { PreferencesSyncUseCase } from '../preferences-sync.use-case'
import { individualGateway, replica } from './use-case-test-fixtures'
import { PreferencesPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('PreferencesSyncUseCase', () => {
  it('Given typed preferences, when they are applied, then the replica receives them', async () => {
    const entity = preferences()
    const data = PreferencesPersistenceMapper.toRecord(entity)
    const local: IPreferencesRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const remote = replica<IPreferences>()
    const useCase = new PreferencesSyncUseCase(
      individualGateway<SyncResource.PREFERENCES>({
        id: data.id,
        data,
        revision: 1,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
      local,
      remote,
    )
    await useCase.applyUpsert('user-1', data)
    expect(remote.upsert).toHaveBeenCalledOnce()
  })
})
