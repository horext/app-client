import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGoogleOAuth2Store } from '~/stores/google-oauth2'

describe('useGoogleOAuth2Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with null tokenResponse and isSignedIn=false', () => {
    const store = useGoogleOAuth2Store()
    expect(store.tokenResponse).toBeNull()
    expect(store.isSignedIn).toBe(false)
  })

  it('starts with isPendingClient=false and isPendingToken=false', () => {
    const store = useGoogleOAuth2Store()
    expect(store.isPendingClient).toBe(false)
    expect(store.isPendingToken).toBe(false)
  })

  it('isSignedIn is true when tokenResponse is set', () => {
    const store = useGoogleOAuth2Store()
    store.tokenResponse = {
      access_token: 'abc',
      token_type: 'Bearer',
    } as google.accounts.oauth2.TokenResponse
    expect(store.isSignedIn).toBe(true)
  })

  it('expiresAt starts as null', () => {
    const store = useGoogleOAuth2Store()
    expect(store.expiresAt).toBeNull()
  })
})
