import { IndividualSyncUseCase } from './individual-sync.use-case'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IndividualResourceSnapshotGateway } from '../ports/individual-resource-snapshot.gateway'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { snapshot } from './aggregate-sync.use-case'
import type { Preferences } from '#shared/domain'
import { PreferencesPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class PreferencesSyncUseCase extends IndividualSyncUseCase<
  IPreferences,
  SyncResource.PREFERENCES,
  Preferences
> {
  constructor(
    api: IndividualResourceSnapshotGateway<SyncResource.PREFERENCES>,
    localRepository: IPreferencesRepository,
    protected readonly repository: ReplicaStore<IPreferences>,
  ) {
    super(
      api,
      snapshot,
      localRepository,
      SyncResource.PREFERENCES,
      PreferencesPersistenceMapper.toRecord,
    )
  }
  protected override readonly resource = SyncResource.PREFERENCES
}
