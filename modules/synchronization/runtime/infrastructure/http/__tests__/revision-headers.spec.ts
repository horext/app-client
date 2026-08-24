import { describe, expect, it } from 'vitest'
import { revisionHeaders } from '../revision-headers'

describe('revisionHeaders', () => {
  it('Given a revision, when headers are created, then it emits a quoted if-match value', () => {
    expect(revisionHeaders(7)).toEqual({ 'if-match': '"7"' })
  })

  it('Given no revision, when headers are created, then it omits if-match', () => {
    expect(revisionHeaders()).toEqual({})
  })
})
