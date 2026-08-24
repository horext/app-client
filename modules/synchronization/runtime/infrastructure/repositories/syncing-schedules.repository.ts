import type { UUID } from 'crypto'
import { GeneratedSchedule, type BaseGeneratedSchedule } from '#shared/domain'
import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'
import type { BulkCollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { BulkCollectionSyncingRepository } from './bulk-collection-syncing-repository.base'
import { GeneratedSchedulePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingSchedulesRepository
  extends BulkCollectionSyncingRepository<
    GeneratedSchedule,
    BaseGeneratedSchedule,
    SyncResource.SCHEDULES
  >
  implements ISchedulesRepository
{
  constructor(
    private readonly local: ISchedulesRepository,
    outbox: BulkCollectionSyncOutbox<SyncResource.SCHEDULES>,
  ) {
    super(
      outbox,
      GeneratedSchedule.reconstitute,
      GeneratedSchedulePersistenceMapper.toCreateRecord,
      GeneratedSchedulePersistenceMapper.toRecord,
    )
  }
  findAll(userId: string) {
    return this.local.findAll(userId)
  }
  findBy(userId: string, id: UUID) {
    return this.local.findBy(userId, id as never)
  }
  getEntries(userId: string, ids: UUID[]) {
    return this.local.getEntries(userId, ids as never)
  }
  getByKey(userId: string, key: string) {
    return this.local.getByKey(userId, key)
  }
  deleteEntry(userId: string, id: UUID) {
    return this.delete(userId, id)
  }
  deleteEntries(userId: string, ids: UUID[]) {
    return this.deleteAll(userId, ids)
  }
}
