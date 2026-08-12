import type { UUID } from 'crypto'

export interface ReplicaReference {
  externalId?: UUID
}

export interface ReplicationState extends ReplicaReference {
  revision?: number
}

export interface ReplicatedIdentity extends ReplicaReference {
  id: UUID
}
