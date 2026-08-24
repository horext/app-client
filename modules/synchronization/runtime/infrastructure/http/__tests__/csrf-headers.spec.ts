import { afterEach, describe, expect, it } from 'vitest'
import { syncMutationHeaders } from '../csrf-headers'
import { revisionHeaders } from '../revision-headers'

describe('synchronization mutation headers', () => {
  afterEach(() => {
    document.cookie = 'horext_csrf=; Max-Age=0; Path=/'
  })

  it('Given a CSRF cookie and mutation headers, when headers are composed, then the token and supplied headers are retained', () => {
    document.cookie = 'horext_csrf=token%20value; Path=/'

    expect(syncMutationHeaders({ 'Idempotency-Key': 'operation-1' })).toEqual({
      'Idempotency-Key': 'operation-1',
      'x-csrf-token': 'token value',
    })
    expect(revisionHeaders(7)).toEqual({
      'if-match': '"7"',
      'x-csrf-token': 'token value',
    })
  })
})
