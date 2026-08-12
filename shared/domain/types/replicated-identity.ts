import type { UUID } from 'crypto'
import type { Brand } from './ids'

export interface ReplicaReference {
  externalId?: UUID
}

export interface ReplicationState extends ReplicaReference {
  revision?: number
}

export interface ReplicatedIdentity<
  T extends Brand<UUID, string>,
> extends ReplicaReference {
  id: T
}
