import type {
  AggregateSnapshot,
  CollectionResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type { ResourceMutationResponse } from './individual-resource-snapshot.gateway'

export interface CollectionSnapshotPage<R extends CollectionResource> {
  items: Required<AggregateSnapshot<SyncBodyMap<R>>>[]
  nextCursor: string | null
}

export interface CollectionResourceSnapshotGateway<
  R extends CollectionResource,
> {
  list(cursor?: string): Promise<CollectionSnapshotPage<R>>
  create(
    body: SyncBodyMap<R>,
    operationId: string,
  ): Promise<ResourceMutationResponse>
  update(
    body: SyncBodyMap<R>,
    revision: number,
  ): Promise<ResourceMutationResponse>
  delete(id: string, revision?: number): Promise<ResourceMutationResponse>
}
