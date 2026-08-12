import type { UUID } from 'crypto'
import type { Brand } from './ids'

export interface ReplicaReference<T extends UUID> {
  externalId?: T
}

export interface ReplicationState<T extends UUID> extends ReplicaReference<T> {
  revision?: number
}

export interface ReplicatedIdentity<
  T extends Brand<UUID, string>,
> extends ReplicaReference<T> {
  id: T
}
