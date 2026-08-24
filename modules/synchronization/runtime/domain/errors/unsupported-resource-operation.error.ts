import type { SyncResource } from '~~/modules/synchronization/runtime/contracts'

export class UnsupportedResourceOperationError extends Error {
  constructor(resource: SyncResource, operation: string) {
    super(
      `${operation} is not supported for synchronization resource: ${resource}.`,
    )
    this.name = 'UnsupportedResourceOperationError'
  }
}
