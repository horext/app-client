import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { IndividualSyncGateway } from './individual-sync-api.gateway'

export class ProfileSyncApiGateway extends IndividualSyncGateway<SyncResource.PROFILE> {
  protected readonly path = '/api/v1/profile'
}
