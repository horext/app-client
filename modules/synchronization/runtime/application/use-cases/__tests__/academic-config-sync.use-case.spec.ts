import { describe, expect, it, vi } from 'vitest'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { academicConfig } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { AcademicConfigSyncUseCase } from '../academic-config-sync.use-case'
import { individualGateway, replica } from './use-case-test-fixtures'
import { AcademicConfigPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('AcademicConfigSyncUseCase', () => {
  it('Given a typed academic configuration, when applied, then it is delegated to the replica', async () => {
    const entity = academicConfig()
    const data = AcademicConfigPersistenceMapper.toRecord(entity)
    const local: IAcademicConfigRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const remote = replica<IAcademicConfig>()
    const useCase = new AcademicConfigSyncUseCase(
      individualGateway<SyncResource.ACADEMIC_CONFIG>({
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
