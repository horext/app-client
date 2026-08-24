import {
  SyncOperation,
  type PersistedSyncOperation,
  type SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type {
  HttpResponse,
  SyncMutationApiGateway,
} from './sync-mutation-api.gateway'

export interface SyncOperationHandler<R extends SyncResource> {
  readonly resource: R
  push(operation: PersistedSyncOperation<R>): Promise<number | null>
}

/** Strategy translating one resource's sync commands into HTTP gateway calls. */
export class ApiSyncOperationHandler<
  R extends SyncResource,
> implements SyncOperationHandler<R> {
  constructor(
    readonly resource: R,
    protected readonly api: SyncMutationApiGateway<R>,
  ) {}

  async push(operation: PersistedSyncOperation<R>): Promise<number | null> {
    let response: HttpResponse
    if (operation.operation === SyncOperation.CREATE) {
      response = await this.api.create(operation.body, operation.operationId)
    } else if (operation.operation === SyncOperation.UPDATE) {
      response = await this.patch(operation)
    } else {
      throw new Error(`Unsupported synchronization operation.`)
    }
    return responseRevision(response.headers.get('etag'))
  }

  private patch(
    operation: Extract<
      PersistedSyncOperation<R>,
      { operation: SyncOperation.UPDATE }
    >,
  ): Promise<HttpResponse> {
    if (operation.revision === undefined)
      throw new Error(`${this.resource} update requires a revision.`)
    return this.api.update(operation.body, operation.revision)
  }
}

export function responseRevision(value: string | null): number | null {
  if (value === null) return null
  const revision = Number(value.replaceAll('"', ''))
  return Number.isInteger(revision) && revision >= 0 ? revision : null
}
