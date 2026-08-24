import { describe, expect, it, vi } from 'vitest'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { generation } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { GenerationsSyncUseCase } from '../generations-sync.use-case'
import { collectionGateway, replica } from './use-case-test-fixtures'
import { ScheduleGenerationPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe(' GenerationsSyncUseCase', () => {
  it('Given typed generation records, when applied, then they are delegated to the replica', async () => {
    const entity = generation()
    const local: IGenerationRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const remote = replica<IScheduleGeneration>()
    const useCase = new GenerationsSyncUseCase(
      collectionGateway<SyncResource.GENERATIONS>(),
      local,
      remote,
    )
    await expect(useCase.localSnapshot('user-1')).resolves.toHaveLength(1)
    await useCase.applyUpsert(
      'user-1',
      ScheduleGenerationPersistenceMapper.toRecord(entity),
    )
  })
})
