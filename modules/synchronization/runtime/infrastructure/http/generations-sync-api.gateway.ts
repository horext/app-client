import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncGateway } from './resource-sync-api.gateway'

export class GenerationsSyncApiGateway extends CollectionSyncGateway<SyncResource.GENERATIONS> {
  protected readonly path = '/api/v1/generations'
}
