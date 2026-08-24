import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncGateway } from './resource-sync-api.gateway'

export class SubjectsSyncApiGateway extends CollectionSyncGateway<SyncResource.SUBJECTS> {
  protected readonly path = '/api/v1/subjects'
}
