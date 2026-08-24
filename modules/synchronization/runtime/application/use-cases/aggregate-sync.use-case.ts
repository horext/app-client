import {
  SyncOperation,
  type AggregateSnapshot,
  type CollectionDeleteOperation,
  type CollectionResource,
  type CreateOperation,
  type SyncOperationDto,
  type SyncResource,
  type UpdateOperation,
} from '~~/modules/synchronization/runtime/contracts'
import type { ReplicaRepository } from '../ports/replica-repository'
import { UnsupportedResourceOperationError } from '../../domain/errors/unsupported-resource-operation.error'

export type { AggregateSnapshot }
export type ReplicaStore<T extends { id: ID }, ID = string> = ReplicaRepository<
  T,
  ID
>

export interface IndividualSnapshotRepository<T extends { id: string }> {
  get(userId: string): Promise<T | undefined>
}

export interface SnapshotRecord<T> {
  id: string
  data: T
  revision: number
  createdAt: string
  updatedAt: string
}

export interface SnapshotPage<T> {
  items: SnapshotRecord<T>[]
  nextCursor: string | null
}

export interface SnapshotPageFetcher<T> {
  (cursor?: string): Promise<SnapshotPage<T>>
}

export abstract class BaseSyncUseCase<
  T extends
    import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>,
  R extends SyncResource = SyncResource,
> {
  protected abstract readonly repository: ReplicaStore<T>
  protected abstract readonly resource: R
  abstract localSnapshot(userId: string): Promise<AggregateSnapshot<T>[]>
  abstract cloudSnapshot(): Promise<AggregateSnapshot<T>[]>
  create(snapshot: AggregateSnapshot<T>): SyncOperationDto<R> {
    return createOperation(this.resource, snapshot)
  }
  update(snapshot: AggregateSnapshot<T>): SyncOperationDto<R> {
    return updateOperation(this.resource, snapshot)
  }
  async applyUpsert(userId: string, data: T) {
    await this.repository.upsert(userId, data)
  }
  replaceLocal(userId: string, snapshots: AggregateSnapshot<T>[]) {
    return this.repository.replace(userId, snapshots)
  }
  async applyDelete(_userId: string, _id: string): Promise<void> {
    throw new UnsupportedResourceOperationError(this.resource, 'delete')
  }
  async cloudDeletionOperations(): Promise<SyncOperationDto<R>[]> {
    return []
  }
}
export function snapshot<T>(item: SnapshotRecord<T>): AggregateSnapshot<T> {
  return { ...item, revision: item.revision }
}
export async function pages<T>(
  fetchPage: SnapshotPageFetcher<T>,
): Promise<AggregateSnapshot<T>[]> {
  const result: AggregateSnapshot<T>[] = []
  let cursor: string | undefined
  do {
    const page = await fetchPage(cursor)
    result.push(...page.items.map(snapshot))
    cursor = page.nextCursor ?? undefined
  } while (cursor)
  return result
}
export function createOperation<R extends SyncResource>(
  resource: R,
  item: AggregateSnapshot<
    import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>
  >,
): CreateOperation<R> {
  const revision = item.revision ?? item.data.revision
  return {
    operation: SyncOperation.CREATE,
    resource,
    entityId: item.id,
    body: item.data,
    operationId: crypto.randomUUID(),
    revision,
  }
}
export function updateOperation<R extends SyncResource>(
  resource: R,
  item: AggregateSnapshot<
    import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>
  >,
): UpdateOperation<R> {
  const revision = item.revision ?? item.data.revision
  return {
    operation: SyncOperation.UPDATE,
    resource,
    entityId: item.id,
    body: item.data,
    operationId: crypto.randomUUID(),
    revision,
  }
}
export function deleteOperation<R extends CollectionResource>(
  resource: R,
  id: string,
  revision?: number,
): CollectionDeleteOperation<R> {
  return {
    operation: SyncOperation.DELETE,
    resource,
    entityId: id,
    operationId: crypto.randomUUID(),
    revision,
  }
}
