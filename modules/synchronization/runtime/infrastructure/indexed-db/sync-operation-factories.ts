import type { UUID } from 'crypto'
import { SyncOperation } from '~~/modules/synchronization/runtime/contracts'
import type {
  CollectionResource,
  CollectionDeleteOperation,
  SyncBodyMap,
  SyncResource,
  CreateOperation,
  UpdateOperation,
} from '~~/modules/synchronization/runtime/contracts'

export interface SaveSyncOperationFactory<R extends SyncResource> {
  create(snapshot: SyncBodyMap<R>): CreateOperation<R>
  update(snapshot: SyncBodyMap<R>): UpdateOperation<R>
}

export interface CollectionSyncOperationFactory<
  R extends CollectionResource,
> extends SaveSyncOperationFactory<R> {
  delete(id: UUID, revision?: number): CollectionDeleteOperation<R>
}

export class SaveSyncOperationFactoryImpl<
  R extends SyncResource,
> implements SaveSyncOperationFactory<R> {
  constructor(protected readonly resource: R) {}

  create(snapshot: SyncBodyMap<R>): CreateOperation<R> {
    const revision = snapshot.revision ?? undefined
    return {
      operation: SyncOperation.CREATE,
      resource: this.resource,
      entityId: snapshot.id,
      body: snapshot,
      operationId: crypto.randomUUID(),
      revision,
    }
  }

  update(snapshot: SyncBodyMap<R>): UpdateOperation<R> {
    const revision = snapshot.revision ?? undefined
    return {
      operation: SyncOperation.UPDATE,
      resource: this.resource,
      entityId: snapshot.id,
      body: snapshot,
      operationId: crypto.randomUUID(),
      revision,
    }
  }
}
