import type { Mocked } from 'vitest'
import { describe, it, expect, vi } from 'vitest'
import type { JwtClientOptions } from '../jwt.client'
import { JwtClient } from '../jwt.client'
import type { JwksClient, SigningKey } from 'jwks-rsa'
import type { JwtHeader } from 'jsonwebtoken'

describe('JwtClient', () => {
  const mockJwksClient: Mocked<JwksClient> = {
    getSigningKey: vi
      .fn()
      .mockImplementation((kid, cb) =>
        cb(null, { getPublicKey: () => 'public-key' }),
      ),
    getKeys: vi.fn(),
    getSigningKeys: vi.fn(),
  }

  const options: JwtClientOptions = {
    audience: 'test-audience',
    issuer: 'test-issuer',
  }

  const jwtClient = new JwtClient(options, mockJwksClient)

  it('should call jwksClient.getSigningKey with correct parameters', () => {
    const header: JwtHeader = {
      kid: 'test-kid',
      alg: '',
    }
    const callback = vi.fn()

    jwtClient.getKey(header, callback)

    expect(mockJwksClient.getSigningKey).toHaveBeenCalledWith(
      'test-kid',
      expect.any(Function),
    )
  })

  it('should call callback with error if getSigningKey returns an error', () => {
    const header: JwtHeader = {
      kid: 'test-kid',
      alg: '',
    }
    const callback = vi.fn()
    const error = new Error('test error')

    mockJwksClient.getSigningKey.mockImplementation((kid, cb) => cb(error))

    jwtClient.getKey(header, callback)

    expect(callback).toHaveBeenCalledWith(error)
  })

  it('should call callback with public key if getSigningKey succeeds', () => {
    const header: JwtHeader = {
      kid: 'test-kid',
      alg: '',
    }
    const callback = vi.fn()
    const key: SigningKey = {
      getPublicKey: () => 'public-key',
      kid: 'test-kid',
      alg: '',
      publicKey: '',
      rsaPublicKey: '',
    }

    mockJwksClient.getSigningKey.mockImplementation((kid, cb) => cb(null, key))

    jwtClient.getKey(header, callback)

    expect(callback).toHaveBeenCalledWith(null, 'public-key')
  })

})
