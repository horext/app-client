import { CollectionSyncUseCase } from './collection-sync.use-case'
import type { IGeneratedSchedule } from '#shared/domain/types/schedule'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { GeneratedSchedulePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SchedulesSyncUseCase extends CollectionSyncUseCase<
  IGeneratedSchedule,
  SyncResource.SCHEDULES
> {
  constructor(
    api: CollectionResourceSnapshotGateway<SyncResource.SCHEDULES>,
    private readonly localRepository: ISchedulesRepository,
    protected readonly repository: ReplicaStore<IGeneratedSchedule>,
  ) {
    super(api, (record) => record)
  }
  protected readonly resource = SyncResource.SCHEDULES
  async localSnapshot(userId: string) {
    return (await this.localRepository.findAll(userId)).map((value) => ({
      id: value.id,
      data: GeneratedSchedulePersistenceMapper.toRecord(value),
    }))
  }
}
