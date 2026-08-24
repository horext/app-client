import { CollectionSyncUseCase } from './collection-sync.use-case'
import type { IScheduleFavorite } from '#shared/domain/types/schedule'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import type { ISchedulesFavoritesRepository } from '#shared/application/repositories/schedules.repository'
import type { AggregateSnapshot, ReplicaStore } from './aggregate-sync.use-case'
import { createOperation } from './aggregate-sync.use-case'
import { ScheduleFavoritePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class FavoritesSyncUseCase extends CollectionSyncUseCase<
  IScheduleFavorite,
  SyncResource.FAVORITES
> {
  constructor(
    api: CollectionResourceSnapshotGateway<SyncResource.FAVORITES>,
    private readonly localRepository: ISchedulesFavoritesRepository,
    protected readonly repository: ReplicaStore<IScheduleFavorite>,
  ) {
    super(api, (record) => record)
  }
  protected readonly resource = SyncResource.FAVORITES
  async localSnapshot(userId: string) {
    return (await this.localRepository.findAll(userId)).map((value) => {
      const data = ScheduleFavoritePersistenceMapper.toRecord(value)
      return { id: data.id, data }
    })
  }
  override update(item: AggregateSnapshot<IScheduleFavorite>) {
    return createOperation(SyncResource.FAVORITES, item)
  }
}
