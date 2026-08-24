import { makeUUID } from '~~/shared/domain/types/ids'
import type { UUID } from 'crypto'
import type { ReplicatedIdentity } from '#shared/domain/types/replicated-identity'
import type { Brand } from '#shared/domain/types/ids'

export function fromReplica<T extends Brand<UUID, string>>(
  incoming: ReplicatedIdentity<T>,
  existingLocalId: T = makeUUID<T>(),
): ReplicatedIdentity<T> {
  return {
    ...incoming,
    id: existingLocalId,
    externalId: incoming.id,
  }
}

export function assertReplicaAssociation(
  local: ReplicatedIdentity<Brand<UUID, string>>,
  incoming: ReplicatedIdentity<Brand<UUID, string>>,
): void {
  if (local.externalId !== undefined && local.externalId !== incoming.id)
    throw new Error('identity-conflict')
  if (incoming.externalId !== undefined && incoming.externalId !== local.id)
    throw new Error('identity-conflict')
}
