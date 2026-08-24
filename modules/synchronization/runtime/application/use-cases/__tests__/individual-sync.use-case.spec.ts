import { describe, expect, it, vi } from 'vitest'
import type { IProfile } from '#shared/domain/types/profile'
import type { Profile } from '#shared/domain'
import { ProfilePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { ReplicaRepository } from '../../ports/replica-repository'
import { profile } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import { IndividualSyncUseCase } from '../individual-sync.use-case'
import { individualGateway } from './use-case-test-fixtures'

class TestUseCase extends IndividualSyncUseCase<
  IProfile,
  SyncResource.PROFILE,
  Profile
> {
  protected readonly repository: ReplicaRepository<IProfile> = {
    upsert: vi.fn(),
    replace: vi.fn(),
    delete: vi.fn(),
  }
}

describe('IndividualSyncUseCase', () => {
  it('Given cloud and local singleton values, when snapshots are requested, then each value is normalized as an aggregate snapshot', async () => {
    const entity = profile()
    const data = ProfilePersistenceMapper.toRecord(entity)
    const gateway = individualGateway<SyncResource.PROFILE>({
      id: data.id,
      data,
      revision: 2,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
    const local = { get: vi.fn().mockResolvedValue(entity) }
    const useCase = new TestUseCase(
      gateway,
      (item) => item,
      local,
      SyncResource.PROFILE,
      ProfilePersistenceMapper.toRecord,
    )
    await expect(useCase.cloudSnapshot()).resolves.toEqual([
      expect.objectContaining({ id: data.id, revision: 2 }),
    ])
    await expect(useCase.localSnapshot('user-1')).resolves.toEqual([
      { id: data.id, data },
    ])
  })

  it('Given no local singleton, when a snapshot is requested, then an empty aggregate list is returned', async () => {
    const entity = profile()
    const data = ProfilePersistenceMapper.toRecord(entity)
    const useCase = new TestUseCase(
      individualGateway<SyncResource.PROFILE>({
        id: data.id,
        data,
        revision: 1,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
      (item) => item,
      { get: vi.fn().mockResolvedValue(undefined) },
      SyncResource.PROFILE,
      ProfilePersistenceMapper.toRecord,
    )
    await expect(useCase.localSnapshot('user-1')).resolves.toEqual([])
  })
})
