import { beforeAll, describe, expect, it, vi } from 'vitest'

let isValidGoogleClaims: typeof import('../google').isValidGoogleClaims

beforeAll(async () => {
  vi.stubGlobal('defineNitroPlugin', () => undefined)
  vi.stubGlobal(
    'defineCachedFunction',
    <T extends (...args: never[]) => unknown>(callback: T) => callback,
  )
  ;({ isValidGoogleClaims } = await import('../google'))
})

const header = { alg: 'RS256', kid: 'key-1' }
const claims = {
  sub: 'user-1',
  aud: 'client-1',
  iss: 'https://accounts.google.com',
  exp: 2_000_000_000,
  email: 'user@example.com',
  email_verified: true,
}

describe('Google credential claim validation', () => {
  it('requires an explicitly verified email', () => {
    expect(
      isValidGoogleClaims(header, claims, 'client-1', 1_700_000_000_000),
    ).toBe(true)
    expect(
      isValidGoogleClaims(
        header,
        { ...claims, email_verified: undefined },
        'client-1',
        1_700_000_000_000,
      ),
    ).toBe(false)
    expect(
      isValidGoogleClaims(
        header,
        { ...claims, email_verified: false },
        'client-1',
        1_700_000_000_000,
      ),
    ).toBe(false)
  })

  it('requires the configured audience and RS256 issuer claims', () => {
    expect(
      isValidGoogleClaims(
        header,
        claims,
        'different-client',
        1_700_000_000_000,
      ),
    ).toBe(false)
    expect(
      isValidGoogleClaims(
        { ...header, alg: 'HS256' },
        claims,
        'client-1',
        1_700_000_000_000,
      ),
    ).toBe(false)
  })
})
