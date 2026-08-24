import type { UUID } from 'crypto'
import { PlannedSubject, type BasePlannedSubject } from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { CollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncingRepository } from './collection-syncing-repository.base'
import { PlannedSubjectPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingSubjectsRepository
  extends CollectionSyncingRepository<
    PlannedSubject,
    BasePlannedSubject,
    SyncResource.SUBJECTS
  >
  implements ISubjectsRepository
{
  constructor(
    private readonly local: ISubjectsRepository,
    outbox: CollectionSyncOutbox<SyncResource.SUBJECTS>,
  ) {
    super(
      outbox,
      PlannedSubject.reconstitute,
      PlannedSubjectPersistenceMapper.toCreateRecord,
      PlannedSubjectPersistenceMapper.toRecord,
    )
  }
  findAll(userId: string) {
    return this.local.findAll(userId)
  }
  findById(userId: string, id: UUID) {
    return this.local.findById(userId, id as never)
  }
}
