import type {
  AggregateSnapshot,
  IndividualResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { IndividualResourceSnapshotGateway } from '../ports/individual-resource-snapshot.gateway'
import {
  BaseSyncUseCase,
  type IndividualSnapshotRepository,
} from './aggregate-sync.use-case'

export abstract class IndividualSyncUseCase<
  T extends
    import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>,
  R extends IndividualResource,
  L extends { id: string } = { id: string },
> extends BaseSyncUseCase<T, R> {
  constructor(
    protected readonly api: IndividualResourceSnapshotGateway<R>,
    private readonly decode: (
      record: Required<
        AggregateSnapshot<
          import('~~/modules/synchronization/runtime/contracts').SyncBodyMap<R>
        >
      >,
    ) => AggregateSnapshot<T>,
    private readonly localRepository: IndividualSnapshotRepository<L>,
    protected readonly resource: R,
    private readonly encode: (value: L) => T,
  ) {
    super()
  }

  async cloudSnapshot(): Promise<AggregateSnapshot<T>[]> {
    return [this.decode(await this.api.get())]
  }

  async localSnapshot(userId: string): Promise<AggregateSnapshot<T>[]> {
    const value = await this.localRepository.get(userId)
    return value ? [{ id: value.id, data: this.encode(value) }] : []
  }
}
