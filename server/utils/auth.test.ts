import { describe, it, expect } from 'vitest'
import { extractTokenFromAuthHeader, getAuthorizationHeader, AUTHORIZATION_HEADER } from './auth'

describe('extractTokenFromAuthHeader', () => {
    it('should extract token from valid authorization header', () => {
        const authHeader = 'Bearer valid.token.here'
        const token = extractTokenFromAuthHeader(authHeader)
        expect(token).toBe('valid.token.here')
    })

    it('should return undefined for invalid authorization header', () => {
        const authHeader = 'Invalid token'
        const token = extractTokenFromAuthHeader(authHeader)
        expect(token).toBeUndefined()
    })

    it('should return undefined for empty authorization header', () => {
        const authHeader = ''
        const token = extractTokenFromAuthHeader(authHeader)
        expect(token).toBeUndefined()
    })
})

describe('getAuthorizationHeader', () => {
    it('should return the authorization header if present', () => {
        const headers = new Headers()
        headers.set(AUTHORIZATION_HEADER, 'Bearer valid.token.here')
        const authHeader = getAuthorizationHeader(headers)
        expect(authHeader).toBe('Bearer valid.token.here')
    })

    it('should return null if the authorization header is not present', () => {
        const headers = new Headers()
        const authHeader = getAuthorizationHeader(headers)
        expect(authHeader).toBeNull()
    })
})