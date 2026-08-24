import { describe, expect, it, vi } from 'vitest'
import type { ISchedulesFavoritesRepository } from '#shared/application/repositories/schedules.repository'
import type { IScheduleFavorite } from '#shared/domain/types/schedule'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { SyncOperation } from '~~/modules/synchronization/runtime/contracts'
import { favorite } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { FavoritesSyncUseCase } from '../favorites-sync.use-case'
import { collectionGateway, replica } from './use-case-test-fixtures'
import { ScheduleFavoritePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('FavoritesSyncUseCase', () => {
  it('Given favorites, when local mapping and update run, then favorites use create semantics', async () => {
    const entity = favorite()
    const local: ISchedulesFavoritesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn(),
      findByScheduleId: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    }
    const remote = replica<IScheduleFavorite>()
    const useCase = new FavoritesSyncUseCase(
      collectionGateway<SyncResource.FAVORITES>(),
      local,
      remote,
    )
    const data = ScheduleFavoritePersistenceMapper.toRecord(entity)
    const snapshot = { id: entity.id, data }
    await expect(useCase.localSnapshot('user-1')).resolves.toEqual([snapshot])
    await useCase.applyUpsert('user-1', data)
    expect(useCase.update(snapshot).operation).toBe(SyncOperation.CREATE)
  })
})
