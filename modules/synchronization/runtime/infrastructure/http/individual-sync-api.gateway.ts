import type {
  IndividualResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type { HttpResponse } from './sync-mutation-api.gateway'
import type { SyncApiRecord } from './sync-api.contracts'
import { revisionHeaders } from './revision-headers'
import { syncMutationHeaders } from './csrf-headers'
import type { IndividualSyncApiGateway } from './resource-sync-api.gateway'

export abstract class IndividualSyncGateway<
  R extends IndividualResource,
> implements IndividualSyncApiGateway<R> {
  protected abstract readonly path: string

  get(): Promise<SyncApiRecord<SyncBodyMap<R>>> {
    return $fetch<SyncApiRecord<SyncBodyMap<R>>>(this.path)
  }

  create(body: SyncBodyMap<R>, operationId: string): Promise<HttpResponse> {
    return $fetch.raw<SyncApiRecord<SyncBodyMap<R>>>(this.path, {
      method: 'POST',
      headers: syncMutationHeaders({ 'Idempotency-Key': operationId }),
      body,
    })
  }

  update(body: SyncBodyMap<R>, revision: number): Promise<HttpResponse> {
    return $fetch.raw<SyncApiRecord<SyncBodyMap<R>>>(this.path, {
      method: 'PATCH',
      headers: revisionHeaders(revision),
      body,
    })
  }
}
