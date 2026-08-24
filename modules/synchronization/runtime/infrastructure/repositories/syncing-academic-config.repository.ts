import { AcademicConfig, type BaseAcademicConfig } from '#shared/domain'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { SyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { BaseSyncingRepository } from './syncing-repository.base'
import { AcademicConfigPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingAcademicConfigRepository
  extends BaseSyncingRepository<
    AcademicConfig,
    BaseAcademicConfig,
    SyncResource.ACADEMIC_CONFIG
  >
  implements IAcademicConfigRepository
{
  constructor(
    private readonly local: IAcademicConfigRepository,
    outbox: SyncOutbox<SyncResource.ACADEMIC_CONFIG>,
  ) {
    super(
      outbox,
      AcademicConfig.reconstitute,
      AcademicConfigPersistenceMapper.toCreateRecord,
      AcademicConfigPersistenceMapper.toRecord,
    )
  }
  get(userId: string) {
    return this.local.get(userId)
  }
}
