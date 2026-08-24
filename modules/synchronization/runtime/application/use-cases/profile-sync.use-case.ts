import { IndividualSyncUseCase } from './individual-sync.use-case'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { IProfile } from '#shared/domain/types/profile'
import type { Profile } from '#shared/domain'
import type { IndividualResourceSnapshotGateway } from '../ports/individual-resource-snapshot.gateway'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { snapshot } from './aggregate-sync.use-case'
import { ProfilePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class ProfileSyncUseCase extends IndividualSyncUseCase<
  IProfile,
  SyncResource.PROFILE,
  Profile
> {
  constructor(
    api: IndividualResourceSnapshotGateway<SyncResource.PROFILE>,
    localRepository: IProfileRepository,
    protected readonly repository: ReplicaStore<IProfile>,
  ) {
    super(
      api,
      snapshot,
      localRepository,
      SyncResource.PROFILE,
      ProfilePersistenceMapper.toRecord,
    )
  }
  protected override readonly resource = SyncResource.PROFILE
}
