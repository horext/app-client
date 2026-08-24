import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncGateway } from './resource-sync-api.gateway'

export class SchedulesSyncApiGateway extends CollectionSyncGateway<SyncResource.SCHEDULES> {
  protected readonly path = '/api/v1/schedules'
}
