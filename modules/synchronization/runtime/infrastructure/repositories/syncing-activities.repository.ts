import type { UUID } from 'crypto'
import { Activity, type BaseActivity } from '#shared/domain'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { CollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncingRepository } from './collection-syncing-repository.base'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingActivitiesRepository
  extends CollectionSyncingRepository<
    Activity,
    BaseActivity,
    SyncResource.ACTIVITIES
  >
  implements IActivitiesRepository
{
  constructor(
    private readonly local: IActivitiesRepository,
    outbox: CollectionSyncOutbox<SyncResource.ACTIVITIES>,
  ) {
    super(
      outbox,
      Activity.reconstitute,
      ActivityPersistenceMapper.toCreateRecord,
      ActivityPersistenceMapper.toRecord,
    )
  }
  findAll(userId: string) {
    return this.local.findAll(userId)
  }
  findById(userId: string, id: UUID) {
    return this.local.findById(userId, id as never)
  }
}
