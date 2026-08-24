import { CollectionSyncUseCase } from './collection-sync.use-case'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { ScheduleGenerationPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class GenerationsSyncUseCase extends CollectionSyncUseCase<
  IScheduleGeneration,
  SyncResource.GENERATIONS
> {
  constructor(
    api: CollectionResourceSnapshotGateway<SyncResource.GENERATIONS>,
    private readonly localRepository: IGenerationRepository,
    protected readonly repository: ReplicaStore<IScheduleGeneration>,
  ) {
    super(api, (record) => record)
  }
  protected readonly resource = SyncResource.GENERATIONS
  async localSnapshot(userId: string) {
    return (await this.localRepository.findAll(userId)).map((value) => ({
      id: value.id,
      data: ScheduleGenerationPersistenceMapper.toRecord(value),
    }))
  }
}
