import { Preferences, type BasePreferences } from '#shared/domain'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { SyncOutbox } from '../indexed-db/sync-outbox-base'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { BaseSyncingRepository } from './syncing-repository.base'
import { PreferencesPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SyncingPreferencesRepository
  extends BaseSyncingRepository<
    Preferences,
    BasePreferences,
    SyncResource.PREFERENCES
  >
  implements IPreferencesRepository
{
  constructor(
    private readonly local: IPreferencesRepository,
    outbox: SyncOutbox<SyncResource.PREFERENCES>,
  ) {
    super(
      outbox,
      Preferences.reconstitute,
      PreferencesPersistenceMapper.toCreateRecord,
      PreferencesPersistenceMapper.toRecord,
    )
  }
  get(userId: string) {
    return this.local.get(userId)
  }
}
