import type { UUID } from 'crypto'
import type {
  ReplicableStore,
  ReplicableStoreValue,
} from '~~/modules/schedules-storage/runtime/app/context/db'
import type { RemoteAggregatePersistence } from '~~/modules/schedules-storage/runtime/app/persistence/aggregate-persistence'
import type { AggregateSnapshot } from '~~/modules/synchronization/runtime/contracts'
import type { ReplicaRepository } from '../../application/ports/replica-repository'

/** Applies cloud state to the local replica without creating outbox entries. */
export class IndexedDbReplicaRepository<
  S extends ReplicableStore,
> implements ReplicaRepository<ReplicableStoreValue<S>> {
  constructor(
    private readonly persistence: RemoteAggregatePersistence,
    private readonly store: S,
  ) {}

  async upsert(userId: string, data: ReplicableStoreValue<S>) {
    await this.persistence.saveRemote(this.store, data, userId)
  }

  async delete(userId: string, id: UUID) {
    await this.persistence.remove(this.store, userId, id as never)
  }

  async replace(
    userId: string,
    items: AggregateSnapshot<ReplicableStoreValue<S>>[],
  ) {
    await this.persistence.replace(this.store, userId, items)
  }
}
