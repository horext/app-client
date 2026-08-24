import type { UUID } from 'crypto'
import { ScheduleFavorite } from '#shared/domain'
import type { ISchedulesFavoritesRepository } from '#shared/application/repositories/schedules.repository'
import type { BaseScheduleFavorite } from '#shared/domain'
import type { CollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncingRepository } from './collection-syncing-repository.base'
import { ScheduleFavoritePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingFavoritesRepository
  extends CollectionSyncingRepository<
    ScheduleFavorite,
    BaseScheduleFavorite,
    SyncResource.FAVORITES
  >
  implements ISchedulesFavoritesRepository
{
  constructor(
    private readonly local: ISchedulesFavoritesRepository,
    outbox: CollectionSyncOutbox<SyncResource.FAVORITES>,
  ) {
    super(
      outbox,
      ScheduleFavorite.reconstitute,
      ScheduleFavoritePersistenceMapper.toCreateRecord,
      ScheduleFavoritePersistenceMapper.toRecord,
    )
  }
  findAll(userId: string) {
    return this.local.findAll(userId)
  }
  findById(userId: string, id: UUID) {
    return this.local.findById(userId, id as never)
  }
  findByScheduleId(userId: string, id: UUID) {
    return this.local.findByScheduleId(userId, id as never)
  }
  override async create(userId: string, value: BaseScheduleFavorite) {
    return super.create(userId, value)
  }
  override async update(userId: string, value: ScheduleFavorite) {
    return this.restore(
      await this.outbox.create(
        userId,
        ScheduleFavoritePersistenceMapper.toCreateRecord(value),
      ),
    )
  }
}
