import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readLsJson, readCookieJson } from '../utils'

describe('readLsJson', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
    })
  })

  it('returns parsed JSON when key exists', () => {
    const ls = { getItem: vi.fn().mockReturnValue('{"a":1}') }
    vi.stubGlobal('localStorage', ls)
    expect(readLsJson('key')).toEqual({ a: 1 })
  })

  it('returns null when key does not exist', () => {
    vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue(null) })
    expect(readLsJson('key')).toBeNull()
  })

  it('returns null when JSON parsing fails', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('invalid-json{'),
    })
    expect(readLsJson('key')).toBeNull()
  })
})

describe('readCookieJson', () => {
  beforeEach(() => {
    vi.stubGlobal('document', { cookie: '' })
  })

  it('returns null when cookie not found', () => {
    vi.stubGlobal('document', { cookie: 'other=value' })
    expect(readCookieJson('mykey')).toBeNull()
  })

  it('returns parsed JSON when cookie exists', () => {
    const value = encodeURIComponent(JSON.stringify({ foo: 'bar' }))
    vi.stubGlobal('document', { cookie: `mykey=${value}` })
    expect(readCookieJson('mykey')).toEqual({ foo: 'bar' })
  })

  it('returns null when cookie value is invalid JSON', () => {
    vi.stubGlobal('document', { cookie: `mykey=invalid{json` })
    expect(readCookieJson('mykey')).toBeNull()
  })

  it('handles cookie with multiple cookies', () => {
    const value = encodeURIComponent(JSON.stringify({ x: 1 }))
    vi.stubGlobal('document', {
      cookie: `other=stuff; mykey=${value}; another=val`,
    })
    expect(readCookieJson('mykey')).toEqual({ x: 1 })
  })

  it('handles cookie value with = sign in it', () => {
    const obj = { a: 'b=c' }
    const value = encodeURIComponent(JSON.stringify(obj))
    vi.stubGlobal('document', { cookie: `mykey=${value}` })
    expect(readCookieJson('mykey')).toEqual(obj)
  })
})
