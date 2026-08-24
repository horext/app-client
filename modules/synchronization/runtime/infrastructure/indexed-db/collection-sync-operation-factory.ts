import type { UUID } from 'crypto'
import { SyncOperation } from '~~/modules/synchronization/runtime/contracts'
import type {
  CollectionDeleteOperation,
  CollectionResource,
} from '~~/modules/synchronization/runtime/contracts'
import {
  SaveSyncOperationFactoryImpl,
  type CollectionSyncOperationFactory,
} from './sync-operation-factories'

export class CollectionSyncOperationFactoryImpl<R extends CollectionResource>
  extends SaveSyncOperationFactoryImpl<R>
  implements CollectionSyncOperationFactory<R>
{
  delete(id: UUID, revision?: number): CollectionDeleteOperation<R> {
    return {
      operation: SyncOperation.DELETE,
      resource: this.resource,
      entityId: id,
      operationId: crypto.randomUUID(),
      revision,
    }
  }
}
