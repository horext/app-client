import { isJsonObject, parseJsonValue } from './json'
import { createError, type H3Event } from 'h3'

interface GoogleClaims {
  sub: string
  aud: string | string[]
  iss: string
  exp: number
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
  hd?: string
}
interface JsonWebKeyWithKid extends JsonWebKey {
  kid?: string
  alg?: string
}

function parseGoogleHeader(
  value: string,
): { alg?: string; kid?: string } | null {
  const parsed = parseJsonValue(value)
  if (!isJsonObject(parsed)) return null
  return {
    alg: typeof parsed.alg === 'string' ? parsed.alg : undefined,
    kid: typeof parsed.kid === 'string' ? parsed.kid : undefined,
  }
}

function parseGoogleClaims(value: string): GoogleClaims | null {
  const parsed = parseJsonValue(value)
  if (
    !isJsonObject(parsed) ||
    typeof parsed.sub !== 'string' ||
    (typeof parsed.aud !== 'string' &&
      (!Array.isArray(parsed.aud) ||
        !parsed.aud.every((item) => typeof item === 'string'))) ||
    typeof parsed.iss !== 'string' ||
    typeof parsed.exp !== 'number' ||
    typeof parsed.email !== 'string'
  )
    return null
  const emailVerified =
    typeof parsed.email_verified === 'boolean'
      ? parsed.email_verified
      : undefined
  return {
    sub: parsed.sub,
    aud: parsed.aud,
    iss: parsed.iss,
    exp: parsed.exp,
    email: parsed.email,
    email_verified: emailVerified,
    name: typeof parsed.name === 'string' ? parsed.name : undefined,
    picture: typeof parsed.picture === 'string' ? parsed.picture : undefined,
    hd: typeof parsed.hd === 'string' ? parsed.hd : undefined,
  }
}

function parseGoogleKeys(value: unknown): JsonWebKeyWithKid[] | null {
  if (!isJsonObject(value) || !Array.isArray(value.keys)) return null
  const keys: JsonWebKeyWithKid[] = []
  for (const candidate of value.keys) {
    if (!isJsonObject(candidate)) return null
    const key: JsonWebKeyWithKid = {}
    for (const [name, property] of Object.entries(candidate))
      if (
        typeof property === 'string' ||
        typeof property === 'number' ||
        typeof property === 'boolean' ||
        Array.isArray(property)
      )
        Object.defineProperty(key, name, {
          value: property,
          enumerable: true,
        })
    keys.push(key)
  }
  return keys
}

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(
    normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='),
  )
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(value.byteLength)
  new Uint8Array(buffer).set(value)
  return buffer
}

export async function verifyGoogleCredential(
  _event: H3Event,
  credential: string,
): Promise<GoogleClaims> {
  const parts = credential.split('.')
  const [encodedHeader, encodedClaims, encodedSignature] = parts
  if (
    !encodedHeader ||
    !encodedClaims ||
    !encodedSignature ||
    parts.length !== 3
  )
    throw invalidGoogleCredential('The Google credential is malformed.')
  let header: { alg?: string; kid?: string } | null
  let claims: GoogleClaims | null
  try {
    header = parseGoogleHeader(
      new TextDecoder().decode(decodeBase64Url(encodedHeader)),
    )
    claims = parseGoogleClaims(
      new TextDecoder().decode(decodeBase64Url(encodedClaims)),
    )
  } catch {
    throw invalidGoogleCredential('The Google credential cannot be decoded.')
  }
  if (!header || !claims)
    throw invalidGoogleCredential('The Google credential claims are invalid.')
  const clientId = useRuntimeConfig().public.gsi.clientId
  if (!isValidGoogleClaims(header, claims, clientId)) {
    throw invalidGoogleCredential('The Google credential claims are invalid.')
  }
  let keys = await googleSigningKeys(false)
  let jwk = keys.find((candidate) => candidate.kid === header.kid)
  if (!jwk) {
    keys = await googleSigningKeys(true)
    jwk = keys.find((candidate) => candidate.kid === header.kid)
  }
  if (!jwk)
    throw invalidGoogleCredential(
      'The Google credential signature key is unknown.',
    )
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const signature = toArrayBuffer(decodeBase64Url(encodedSignature))
  const signedData = toArrayBuffer(
    new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`),
  )
  if (
    !(await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature,
      signedData,
    ))
  ) {
    throw invalidGoogleCredential('The Google credential signature is invalid.')
  }
  return claims
}

export function isValidGoogleClaims(
  header: { alg?: string; kid?: string },
  claims: GoogleClaims,
  clientId: string,
  now = Date.now(),
): boolean {
  const validAudience =
    clientId.length > 0 &&
    (Array.isArray(claims.aud)
      ? claims.aud.includes(clientId)
      : claims.aud === clientId)
  return (
    header.alg === 'RS256' &&
    validAudience &&
    ['accounts.google.com', 'https://accounts.google.com'].includes(
      claims.iss,
    ) &&
    claims.exp > now / 1000 &&
    claims.sub.length > 0 &&
    claims.email.length > 0 &&
    claims.email_verified === true
  )
}

const googleSigningKeys = defineCachedFunction(
  async (_forceRefresh: boolean): Promise<JsonWebKeyWithKid[]> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5_000)
    try {
      let response: Response
      try {
        response = await fetch('https://www.googleapis.com/oauth2/v3/certs', {
          signal: controller.signal,
        })
      } catch {
        throw identityProviderError(
          'Google authentication is temporarily unavailable.',
          'identity-provider-unavailable',
        )
      }
      if (!response.ok)
        throw identityProviderError(
          'Google authentication is temporarily unavailable.',
          'identity-provider-unavailable',
        )
      let parsed: unknown
      try {
        parsed = await response.json()
      } catch {
        throw identityProviderError(
          'Google returned an invalid signing-key response.',
          'identity-provider-invalid-response',
        )
      }
      const keys = parseGoogleKeys(parsed)
      if (!keys)
        throw identityProviderError(
          'Google returned an invalid signing-key response.',
          'identity-provider-invalid-response',
        )
      return keys
    } finally {
      clearTimeout(timeout)
    }
  },
  {
    name: 'google-signing-keys',
    group: 'authentication',
    getKey: () => 'jwks',
    maxAge: 60 * 60,
    swr: true,
    shouldInvalidateCache: (forceRefresh) => forceRefresh,
  },
)

function invalidGoogleCredential(message: string) {
  return createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message,
    data: { code: 'invalid-google-credential' },
  })
}

function identityProviderError(message: string, code: string) {
  return createError({
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message,
    data: { code },
  })
}
