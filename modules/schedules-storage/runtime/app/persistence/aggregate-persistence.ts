import type { AggregateSnapshot } from '#shared/domain/synchronization'
import type { ReplicableSchemas, ReplicableStore } from '../context/db'

export interface AggregatePersistence {
  find<S extends ReplicableStore>(
    store: S,
    userId: string,
    id: ReplicableSchemas[S]['key'][1],
  ): Promise<ReplicableSchemas[S]['value'] | undefined>
  findAll<S extends ReplicableStore>(
    store: S,
    userId: string,
  ): Promise<ReplicableSchemas[S]['value'][]>
  findByIndex<S extends ReplicableStore>(
    store: S,
    index: keyof ReplicableSchemas[S]['indexes'] & string,
    key: IDBValidKey,
  ): Promise<ReplicableSchemas[S]['value'] | undefined>
  findAllByIndex<S extends ReplicableStore>(
    store: S,
    index: keyof ReplicableSchemas[S]['indexes'] & string,
    key: IDBValidKey,
  ): Promise<ReplicableSchemas[S]['value'][]>
  create<S extends ReplicableStore>(
    store: S,
    value: Omit<
      ReplicableSchemas[S]['value'],
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
    >,
    userId: string,
  ): Promise<ReplicableSchemas[S]['value']>
  update<S extends ReplicableStore>(
    store: S,
    value: Omit<ReplicableSchemas[S]['value'], 'updatedAt' | 'updatedBy'>,
    userId: string,
  ): Promise<ReplicableSchemas[S]['value']>
  remove<S extends ReplicableStore>(
    store: S,
    userId: string,
    id: ReplicableSchemas[S]['key'][1],
  ): Promise<void>
}

/** Application port used when applying remote state to local records. */
export interface RemoteAggregatePersistence {
  remove<S extends ReplicableStore>(
    store: S,
    userId: string,
    id: ReplicableSchemas[S]['key'][1],
  ): Promise<void>
  saveRemote<S extends ReplicableStore>(
    store: S,
    value: ReplicableSchemas[S]['value'],
    userId: string,
  ): Promise<void>
  replace<S extends ReplicableStore>(
    store: S,
    userId: string,
    items: AggregateSnapshot<ReplicableSchemas[S]['value']>[],
  ): Promise<void>
}
