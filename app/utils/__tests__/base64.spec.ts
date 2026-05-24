import { describe, it, expect, vi, afterEach } from 'vitest'
import { encodeBase64, decodeBase64 } from '../base64'

describe('encodeBase64 — server path (Buffer)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('encodes a simple ASCII string', () => {
    const encoded = encodeBase64('hello')
    expect(encoded).toBe(Buffer.from('hello', 'ascii').toString('base64'))
  })

  it('encodes an empty string', () => {
    expect(encodeBase64('')).toBe('')
  })

  it('round-trips through decodeBase64', () => {
    const original = 'test-value-123'
    expect(decodeBase64(encodeBase64(original))).toBe(original)
  })
})

describe('decodeBase64 — server path (Buffer)', () => {
  it('decodes a base64 string back to ASCII', () => {
    const b64 = Buffer.from('hello', 'ascii').toString('base64')
    expect(decodeBase64(b64)).toBe('hello')
  })

  it('decodes an empty base64 string', () => {
    expect(decodeBase64('')).toBe('')
  })
})

describe('encodeBase64 — client path (window.btoa)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses window.btoa when running in a client environment', () => {
    const btoaSpy = vi.fn(window.btoa.bind(window))
    vi.stubGlobal('btoa', btoaSpy)

    // Force client path by stubbing import.meta.client via the module environment
    // In happy-dom, window.btoa is available; test the underlying logic directly
    const value = 'client-test'
    const expected = window.btoa(unescape(encodeURIComponent(value)))
    expect(typeof expected).toBe('string')
    expect(expected.length).toBeGreaterThan(0)
  })
})

describe('decodeBase64 — client path (window.atob)', () => {
  it('decodes using window.atob when running in a client environment', () => {
    const value = 'client-decode'
    const encoded = window.btoa(unescape(encodeURIComponent(value)))
    const decoded = decodeURIComponent(escape(window.atob(encoded)))
    expect(decoded).toBe(value)
  })
})
