import type { FetchResponse } from 'ofetch'
import type { AggregateSnapshot } from '~~/modules/synchronization/runtime/contracts'

export type SyncApiRecord<T> = Required<
  Pick<
    AggregateSnapshot<T>,
    'id' | 'data' | 'revision' | 'createdAt' | 'updatedAt'
  >
>

export interface SyncApiPage<T> {
  items: SyncApiRecord<T>[]
  nextCursor: string | null
}

export type SyncApiMutationResponse<T> = FetchResponse<SyncApiRecord<T>>
export type SyncApiDeleteResponse = FetchResponse<null>
