/** Serializable aggregate envelope shared by persistence and synchronization. */
export interface AggregateSnapshot<T> {
  id: string
  data: T
  revision?: number
  createdAt?: string
  updatedAt?: string
}

export interface SnapshotSource<T> {
  toSnapshot(): T
}
