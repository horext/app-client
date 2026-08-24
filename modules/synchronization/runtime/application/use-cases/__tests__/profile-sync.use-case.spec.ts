import { describe, expect, it, vi } from 'vitest'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { IProfile } from '#shared/domain/types/profile'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { profile } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { ProfileSyncUseCase } from '../profile-sync.use-case'
import { individualGateway, replica } from './use-case-test-fixtures'
import { ProfilePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

describe('ProfileSyncUseCase', () => {
  it('Given typed profile snapshots, when local and cloud data are handled, then mapping is preserved', async () => {
    const entity = profile()
    const data = ProfilePersistenceMapper.toRecord(entity)
    const local: IProfileRepository = {
      get: vi.fn().mockResolvedValue(entity),
      create: vi.fn(),
      update: vi.fn(),
    }
    const remote = replica<IProfile>()
    const gateway = individualGateway<SyncResource.PROFILE>({
      id: data.id,
      data,
      revision: 2,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
    const useCase = new ProfileSyncUseCase(gateway, local, remote)
    await expect(useCase.localSnapshot('user-1')).resolves.toHaveLength(1)
    await expect(useCase.cloudSnapshot()).resolves.toEqual([
      expect.objectContaining({ id: data.id, revision: 2 }),
    ])
    await useCase.applyUpsert('user-1', data)
  })
})
