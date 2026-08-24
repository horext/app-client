import { describe, expect, it, vi } from 'vitest'
import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'
import type { IGeneratedSchedule } from '#shared/domain/types/schedule'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { schedule } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { SchedulesSyncUseCase } from '../schedules-sync.use-case'
import { collectionGateway, replica } from './use-case-test-fixtures'
import { GeneratedSchedulePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SchedulesSyncUseCase', () => {
  it('Given typed schedules, when applied, then they are delegated to the replica', async () => {
    const entity = schedule()
    const local: ISchedulesRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findBy: vi.fn(),
      getEntries: vi.fn(),
      getByKey: vi.fn(),
      create: vi.fn(),
      createAll: vi.fn(),
      update: vi.fn(),
      deleteEntry: vi.fn(),
      deleteEntries: vi.fn(),
    }
    const remote = replica<IGeneratedSchedule>()
    const useCase = new SchedulesSyncUseCase(
      collectionGateway<SyncResource.SCHEDULES>(),
      local,
      remote,
    )
    await expect(useCase.localSnapshot('user-1')).resolves.toHaveLength(1)
    await useCase.applyUpsert(
      'user-1',
      GeneratedSchedulePersistenceMapper.toRecord(entity),
    )
  })
})
