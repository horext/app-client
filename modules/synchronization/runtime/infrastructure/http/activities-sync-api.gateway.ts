import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncGateway } from './resource-sync-api.gateway'

export class ActivitiesSyncApiGateway extends CollectionSyncGateway<SyncResource.ACTIVITIES> {
  protected readonly path = '/api/v1/activities'
}
