import {
  SyncOperation,
  type CollectionResource,
  type PersistedSyncOperation,
} from '~~/modules/synchronization/runtime/contracts'
import type {
  CollectionSyncMutationApiGateway,
  HttpResponse,
} from './sync-mutation-api.gateway'
import {
  ApiSyncOperationHandler,
  responseRevision,
} from './sync-operation-handler'

export class CollectionApiSyncOperationHandler<
  R extends CollectionResource,
> extends ApiSyncOperationHandler<R> {
  constructor(
    resource: R,
    protected override readonly api: CollectionSyncMutationApiGateway<R>,
  ) {
    super(resource, api)
  }

  override async push(
    operation: PersistedSyncOperation<R>,
  ): Promise<number | null> {
    if (operation.operation !== SyncOperation.DELETE)
      return super.push(operation)
    const response = await this.delete(operation)
    return responseRevision(response.headers.get('etag'))
  }

  private delete(
    operation: Extract<
      PersistedSyncOperation<R>,
      { operation: SyncOperation.DELETE }
    >,
  ): Promise<HttpResponse> {
    if (operation.revision === undefined)
      throw new Error(`${this.resource} delete requires a revision.`)
    return this.api.delete(operation.entityId, operation.revision)
  }
}
