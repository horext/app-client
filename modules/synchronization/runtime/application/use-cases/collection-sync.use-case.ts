import type {
  AggregateSnapshot,
  CollectionDeleteOperation,
  CollectionResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import {
  BaseSyncUseCase,
  deleteOperation,
  pages,
} from './aggregate-sync.use-case'

export abstract class CollectionSyncUseCase<
  T extends
    import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>,
  R extends CollectionResource,
> extends BaseSyncUseCase<T, R> {
  constructor(
    protected readonly api: CollectionResourceSnapshotGateway<R>,
    private readonly decode: (
      record: AggregateSnapshot<
        import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>
      >,
    ) => AggregateSnapshot<T>,
  ) {
    super()
  }

  async cloudSnapshot(): Promise<AggregateSnapshot<T>[]> {
    const records = await pages((cursor) => this.api.list(cursor))
    return records.map(this.decode)
  }

  override applyDelete(userId: string, id: string) {
    return this.repository.delete(userId, id)
  }

  delete(id: string, revision?: number): CollectionDeleteOperation<R> {
    return deleteOperation(this.resource, id, revision)
  }

  override async cloudDeletionOperations(): Promise<
    CollectionDeleteOperation<R>[]
  > {
    return (await this.cloudSnapshot()).map((item) =>
      this.delete(item.id, item.revision),
    )
  }
}
