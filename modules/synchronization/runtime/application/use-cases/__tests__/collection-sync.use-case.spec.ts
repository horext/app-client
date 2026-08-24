import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it, vi } from 'vitest'
import type { IActivity } from '#shared/domain/types/event'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { ReplicaRepository } from '../../ports/replica-repository'
import { CollectionSyncUseCase } from '../collection-sync.use-case'
import { collectionGateway } from './use-case-test-fixtures'

class TestUseCase extends CollectionSyncUseCase<
  IActivity,
  SyncResource.ACTIVITIES
> {
  protected readonly resource = SyncResource.ACTIVITIES
  protected readonly repository: ReplicaRepository<IActivity> = {
    upsert: vi.fn(),
    replace: vi.fn(),
    delete: vi.fn(),
  }
  async localSnapshot() {
    return []
  }
}

describe('CollectionSyncUseCase', () => {
  it('Given a collection gateway, when snapshots and deletion are requested, then pagination and replica deletion are delegated', async () => {
    const useCase = new TestUseCase(
      collectionGateway<SyncResource.ACTIVITIES>(),
      (item) => item,
    )
    await expect(useCase.cloudSnapshot()).resolves.toEqual([])
    await useCase.applyDelete('user-1', makeUUID())
    expect(useCase.delete(makeUUID(), 4)).toMatchObject({
      operation: SyncOperation.DELETE,
      revision: 4,
    })
  })
})
