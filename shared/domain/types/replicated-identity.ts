import type { UUID } from 'crypto'

export interface ReplicatedIdentity {
  id: UUID
  externalId?: UUID
}

export type UnsynchronizedEntity<T> = T & {
  id: UUID
  externalId?: undefined
}

export type SynchronizedEntity<T> = T & {
  id: UUID
  externalId: UUID
}

export interface RepositoryCreateContext {
  externalId?: UUID
}
