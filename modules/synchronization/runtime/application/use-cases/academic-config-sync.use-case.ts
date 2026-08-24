import { IndividualSyncUseCase } from './individual-sync.use-case'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { AcademicConfig } from '#shared/domain'
import type { IndividualResourceSnapshotGateway } from '../ports/individual-resource-snapshot.gateway'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { snapshot } from './aggregate-sync.use-case'
import { AcademicConfigPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class AcademicConfigSyncUseCase extends IndividualSyncUseCase<
  IAcademicConfig,
  SyncResource.ACADEMIC_CONFIG,
  AcademicConfig
> {
  constructor(
    api: IndividualResourceSnapshotGateway<SyncResource.ACADEMIC_CONFIG>,
    localRepository: IAcademicConfigRepository,
    protected readonly repository: ReplicaStore<IAcademicConfig>,
  ) {
    super(
      api,
      snapshot,
      localRepository,
      SyncResource.ACADEMIC_CONFIG,
      AcademicConfigPersistenceMapper.toRecord,
    )
  }
  protected override readonly resource = SyncResource.ACADEMIC_CONFIG
}
