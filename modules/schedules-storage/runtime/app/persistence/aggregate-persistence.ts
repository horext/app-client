import type { AggregateSnapshot } from '#shared/domain/synchronization'
import type {
  ReplicableSchemas,
  ReplicableStore,
  ReplicableStoreValue,
} from '../context/db'

export type ReplicableStoreCreate<S extends ReplicableStore = ReplicableStore> =
  Omit<
    ReplicableStoreValue<S>,
    'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
  > &
    Partial<Pick<ReplicableStoreValue<S>, 'id'>>

export type ReplicableStoreCreateResult<
  S extends ReplicableStore = ReplicableStore,
> = ReplicableStoreCreate<S> & {
  id: ReplicableStoreValue<S>['id']
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export type ReplicableStoreUpdate<S extends ReplicableStore = ReplicableStore> =
  Omit<ReplicableSchemas[S]['value'], 'updatedAt' | 'updatedBy'>

export type ReplicableStoreUpdateResult<
  S extends ReplicableStore = ReplicableStore,
> = ReplicableStoreUpdate<S> & {
  updatedAt: string
  updatedBy: string
}
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
    value: ReplicableStoreCreate<S>,
    userId: string,
  ): Promise<ReplicableStoreCreateResult<S>>
  update<S extends ReplicableStore>(
    store: S,
    value: ReplicableStoreUpdate<S>,
    userId: string,
  ): Promise<ReplicableStoreUpdateResult<S>>
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
