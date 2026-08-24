import type { IScheduleFavorite } from '#shared/domain/types/schedule'
import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import { CollectionSyncGateway } from './resource-sync-api.gateway'

export class FavoritesSyncApiGateway extends CollectionSyncGateway<SyncResource.FAVORITES> {
  protected readonly path = '/api/v1/favorites'

  protected override createBody(
    body: IScheduleFavorite,
  ): Record<string, unknown> {
    return { scheduleId: body.id }
  }
}
