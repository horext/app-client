import { makeUUID } from '~~/shared/domain/types/ids'
import { describe, expect, it } from 'vitest'
import { assertReplicaAssociation, fromReplica } from '../replica-identity'

describe('replica identity', () => {
  it('Given associated remote and local identities, when the association is reversed, then each identity points to its counterpart', () => {
    const localId = makeUUID()
    const remoteId = makeUUID()

    expect(fromReplica({ id: remoteId }, localId)).toEqual({
      id: localId,
      externalId: remoteId,
    })
  })

  it('Given an existing replica association, when a replacement is attempted, then the policy rejects it', () => {
    expect(() =>
      assertReplicaAssociation(
        { id: makeUUID(), externalId: makeUUID() },
        { id: makeUUID() },
      ),
    ).toThrow('identity-conflict')
  })
})
