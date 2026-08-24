import type {
  CollectionResource,
  IndividualResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type {
  HttpResponse,
  CollectionSyncMutationApiGateway,
  SyncMutationApiGateway,
} from './sync-mutation-api.gateway'
import { revisionHeaders } from './revision-headers'
import { syncMutationHeaders } from './csrf-headers'
import type { SyncApiPage, SyncApiRecord } from './sync-api.contracts'

export interface CollectionSyncApiGateway<
  R extends CollectionResource,
> extends CollectionSyncMutationApiGateway<R> {
  list(cursor?: string): Promise<SyncApiPage<SyncBodyMap<R>>>
  update(body: SyncBodyMap<R>, revision: number): Promise<HttpResponse>
  delete(id: string, revision?: number): Promise<HttpResponse>
}

export interface IndividualSyncApiGateway<
  R extends IndividualResource,
> extends SyncMutationApiGateway<R> {
  get(): Promise<SyncApiRecord<SyncBodyMap<R>>>
  update(body: SyncBodyMap<R>, revision: number): Promise<HttpResponse>
}

/** Shared transport mechanics for collection resources. */
export abstract class CollectionSyncGateway<
  R extends CollectionResource,
> implements CollectionSyncApiGateway<R> {
  protected abstract readonly path: string
  protected createBody(body: SyncBodyMap<R>): Record<string, unknown> {
    return { ...body, externalId: body.id }
  }

  list(cursor?: string): Promise<SyncApiPage<SyncBodyMap<R>>> {
    return $fetch<SyncApiPage<SyncBodyMap<R>>>(this.path, {
      query: { cursor, limit: 500 },
    })
  }

  create(body: SyncBodyMap<R>, operationId: string): Promise<HttpResponse> {
    return $fetch.raw<SyncApiRecord<SyncBodyMap<R>>>(this.path, {
      method: 'POST',
      headers: syncMutationHeaders({ 'Idempotency-Key': operationId }),
      body: this.createBody(body),
    })
  }

  update(body: SyncBodyMap<R>, revision: number): Promise<HttpResponse> {
    return $fetch.raw<SyncApiRecord<SyncBodyMap<R>>>(
      `${this.path}/${encodeURIComponent(body.id)}`,
      { method: 'PATCH', headers: revisionHeaders(revision), body },
    )
  }

  delete(id: string, revision?: number): Promise<HttpResponse> {
    return $fetch.raw<null>(`${this.path}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: revisionHeaders(revision),
    })
  }
}
