import { makeUUID } from '~~/shared/domain/types/ids'
import type { UUID } from 'crypto'
import type { ReplicatedIdentity } from '#shared/domain/types/replicated-identity'
import type { Brand } from '#shared/domain/types/ids'

export function createReplicaIdentity<T extends Brand<UUID, string>>(
  externalId?: T,
): ReplicatedIdentity<T> {
  return {
    id: makeUUID<T>(),
    externalId,
  }
}
