import { CollectionSyncUseCase } from './collection-sync.use-case'
import type { IActivity } from '#shared/domain/types/event'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class ActivitiesSyncUseCase extends CollectionSyncUseCase<
  IActivity,
  SyncResource.ACTIVITIES
> {
  constructor(
    api: CollectionResourceSnapshotGateway<SyncResource.ACTIVITIES>,
    private readonly localRepository: IActivitiesRepository,
    protected readonly repository: ReplicaStore<IActivity>,
  ) {
    super(api, (record) => record)
  }
  protected readonly resource = SyncResource.ACTIVITIES
  async localSnapshot(userId: string) {
    return (await this.localRepository.findAll(userId)).map((value) => ({
      id: value.id,
      data: ActivityPersistenceMapper.toRecord(value),
    }))
  }
}
