import type { AggregateSnapshot } from '~~/modules/synchronization/runtime/contracts'

export interface ReplicaRepository<T extends { id: ID }, ID = string> {
  upsert(userId: string, data: T): Promise<void>
  delete(userId: string, id: ID): Promise<void>
  replace(userId: string, snapshots: AggregateSnapshot<T>[]): Promise<void>
}
