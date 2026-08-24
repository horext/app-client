import { describe, expect, it, vi } from 'vitest'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IActivity } from '#shared/domain/types/event'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { activity } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { ActivitiesSyncUseCase } from '../activities-sync.use-case'
import { collectionGateway, replica } from './use-case-test-fixtures'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('ActivitiesSyncUseCase', () => {
  it('Given typed activities, when snapshots are read and applied, then entities are mapped and delegated', async () => {
    const entity = activity()
    const local: IActivitiesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const remote = replica<IActivity>()
    const useCase = new ActivitiesSyncUseCase(
      collectionGateway<SyncResource.ACTIVITIES>(),
      local,
      remote,
    )
    const data = ActivityPersistenceMapper.toRecord(entity)
    await expect(useCase.localSnapshot('user-1')).resolves.toEqual([
      { id: entity.id, data },
    ])
    await useCase.applyUpsert('user-1', data)
    expect(remote.upsert).toHaveBeenCalledOnce()
  })
})
