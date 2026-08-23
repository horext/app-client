/** Serializable aggregate envelope shared by persistence and synchronization. */
export interface AggregateSnapshot<T> {
  id: string
  data: T
  revision?: number
  createdAt?: string
  updatedAt?: string
}

export type Snapshot<T> = Required<AggregateSnapshot<T>>
