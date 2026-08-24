import type {
  CollectionResource,
  SyncResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'

export type HttpResponse = { headers: Headers }

export interface SyncMutationApiGateway<R extends SyncResource = SyncResource> {
  create<B extends SyncBodyMap<R> = SyncBodyMap<R>>(
    body: B,
    operationId: string,
  ): Promise<HttpResponse>
  update<B extends SyncBodyMap<R> = SyncBodyMap<R>>(
    body: B,
    revision: number,
  ): Promise<HttpResponse>
}

export interface CollectionSyncMutationApiGateway<
  R extends CollectionResource = CollectionResource,
> extends SyncMutationApiGateway<R> {
  delete(id: string, revision?: number): Promise<HttpResponse>
}
