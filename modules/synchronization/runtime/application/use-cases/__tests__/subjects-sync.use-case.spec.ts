import { describe, expect, it, vi } from 'vitest'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { subject } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { SubjectsSyncUseCase } from '../subjects-sync.use-case'
import { collectionGateway, replica } from './use-case-test-fixtures'
import { PlannedSubjectPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('SubjectsSyncUseCase', () => {
  it('Given typed subjects, when applied, then they are delegated to the replica', async () => {
    const entity = subject()
    const local: ISubjectsRepository = {
      findAll: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    const remote = replica<IPlannedSubject>()
    const useCase = new SubjectsSyncUseCase(
      collectionGateway<SyncResource.SUBJECTS>(),
      local,
      remote,
    )
    await expect(useCase.localSnapshot('user-1')).resolves.toHaveLength(1)
    await useCase.applyUpsert(
      'user-1',
      PlannedSubjectPersistenceMapper.toRecord(entity),
    )
  })
})
