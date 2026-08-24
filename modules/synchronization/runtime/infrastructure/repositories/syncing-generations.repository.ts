import type { UUID } from 'crypto'
import { ScheduleGeneration, type BaseScheduleGeneration } from '#shared/domain'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { CollectionSyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncingRepository } from './collection-syncing-repository.base'
import { ScheduleGenerationPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingGenerationsRepository
  extends CollectionSyncingRepository<
    ScheduleGeneration,
    BaseScheduleGeneration,
    SyncResource.GENERATIONS
  >
  implements IGenerationRepository
{
  constructor(
    private readonly local: IGenerationRepository,
    outbox: CollectionSyncOutbox<SyncResource.GENERATIONS>,
  ) {
    super(
      outbox,
      ScheduleGeneration.reconstitute,
      ScheduleGenerationPersistenceMapper.toCreateRecord,
      ScheduleGenerationPersistenceMapper.toRecord,
    )
  }
  findAll(userId: string) {
    return this.local.findAll(userId)
  }
  findById(userId: string, id: UUID) {
    return this.local.findById(userId, id as never)
  }
}
