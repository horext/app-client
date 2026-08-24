import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { IndividualSyncGateway } from './individual-sync-api.gateway'

export class PreferencesSyncApiGateway extends IndividualSyncGateway<SyncResource.PREFERENCES> {
  protected readonly path = '/api/v1/preferences'
}
