import type { ResourceType } from '../../../../utils/cloud-types'
import type { IAuditable } from '#shared/domain/types/entity-metadata'

export class RepositoryRevisionConflictError extends Error {
  override readonly name = 'RepositoryRevisionConflictError'

  constructor(
    readonly resource: ResourceType,
    readonly recordId: string,
  ) {
    super(`The ${resource} resource ${recordId} has changed.`)
  }
}

export function staleRepositoryRevision(
  resource: ResourceType,
  id: string,
): never {
  throw new RepositoryRevisionConflictError(resource, id)
}

export function timestamps<T extends IAuditable>(payload: T) {
  return {
    payloadJson: payload,
    revision: 1,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    deletedAt: null,
  }
}
