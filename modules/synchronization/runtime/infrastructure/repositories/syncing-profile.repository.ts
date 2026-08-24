import { Profile, type BaseProfile } from '#shared/domain'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { SyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { BaseSyncingRepository } from './syncing-repository.base'
import { ProfilePersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingProfileRepository
  extends BaseSyncingRepository<Profile, BaseProfile, SyncResource.PROFILE>
  implements IProfileRepository
{
  constructor(
    private readonly local: IProfileRepository,
    outbox: SyncOutbox<SyncResource.PROFILE>,
  ) {
    super(
      outbox,
      Profile.reconstitute,
      ProfilePersistenceMapper.toCreateRecord,
      ProfilePersistenceMapper.toRecord,
    )
  }
  get(userId: string) {
    return this.local.get(userId)
  }
}
