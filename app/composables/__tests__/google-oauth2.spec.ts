import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { useGoogleOAuth2Store } from '~/stores/google-oauth2'

import { useGoogleOAuth2 } from '../google-oauth2'

const { mockUseRuntimeConfig } = vi.hoisted(() => ({
  mockUseRuntimeConfig: vi.fn(() => ({
    public: {
      gsi: {
        clientId: 'test-client-id',
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    },
    app: {
      baseURL: '/',
    },
  })),
}))

const mockOnLoaded = vi.fn()

mockNuxtImport('useGoogleAccounts', () =>
  vi.fn(() => ({
    onLoaded: mockOnLoaded,
  })),
)

mockNuxtImport('useRuntimeConfig', () => mockUseRuntimeConfig)

vi.mock('ofetch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ofetch')>()
  return {
    ...actual,
    ofetch: Object.assign(vi.fn(), actual.ofetch, {
      create: vi.fn(() => vi.fn()),
    }),
  }
})

// Mock google global
const mockInitTokenClient = vi.fn((opts: Record<string, unknown>) => ({
  requestAccessToken: vi.fn(),
  _opts: opts,
}))

const mockRevoke = vi.fn()

vi.stubGlobal('google', {
  accounts: {
    oauth2: {
      initTokenClient: mockInitTokenClient,
      revoke: mockRevoke,
    },
  },
})

describe('useGoogleOAuth2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns expected properties', () => {
    const result = useGoogleOAuth2()
    expect(result.getToken).toBeTypeOf('function')
    expect(result.revokeToken).toBeTypeOf('function')
    expect(result.googleApis).toBeDefined()
    expect(result.isSignedIn).toBeDefined()
    expect(result.signOut).toBeTypeOf('function')
    expect(result.fetchCalendars).toBeTypeOf('function')
    expect(result.createCalendar).toBeTypeOf('function')
    expect(result.createEvent).toBeTypeOf('function')
  })

  it('calls onLoaded with loadClient on setup', () => {
    useGoogleOAuth2()
    expect(mockOnLoaded).toHaveBeenCalledWith(expect.any(Function))
  })

  it('getToken sets isPendingToken to true and requests access token', () => {
    const requestAccessToken = vi.fn()
    const store = useGoogleOAuth2Store()
    store.tokenClient = { requestAccessToken } as never
    const { getToken } = useGoogleOAuth2()
    getToken()
    expect(store.isPendingToken).toBe(true)
    expect(requestAccessToken).toHaveBeenCalled()
  })

  it('revokeToken calls google.accounts.oauth2.revoke', () => {
    const fakeResponse = {
      access_token: 'abc123',
    } as google.accounts.oauth2.TokenResponse
    const { revokeToken } = useGoogleOAuth2()
    revokeToken(fakeResponse)
    expect(mockRevoke).toHaveBeenCalledWith('abc123', expect.any(Function))
  })

  it('signOut revokes token and clears tokenResponse when token exists', async () => {
    const fakeResponse = {
      access_token: 'abc123',
    } as google.accounts.oauth2.TokenResponse
    const store = useGoogleOAuth2Store()
    store.tokenResponse = fakeResponse
    const { signOut } = useGoogleOAuth2()
    await signOut()
    expect(mockRevoke).toHaveBeenCalled()
    expect(store.tokenResponse).toBeNull()
  })

  it('signOut does nothing when tokenResponse is null', async () => {
    const { signOut } = useGoogleOAuth2()
    await signOut()
    expect(mockRevoke).not.toHaveBeenCalled()
  })

  it('loadClient (via onLoaded callback) initializes tokenClient', async () => {
    useGoogleOAuth2()
    // Get the loadClient function that was passed to onLoaded
    const loadClient = mockOnLoaded.mock.calls[0]?.[0]
    await loadClient()
    expect(mockInitTokenClient).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: 'test-client-id' }),
    )
    expect(useGoogleOAuth2Store().isPendingClient).toBe(false)
  })

  it('loadClient does not reinitialize if tokenClient already exists', async () => {
    const store = useGoogleOAuth2Store()
    store.tokenClient = { requestAccessToken: vi.fn() } as never
    useGoogleOAuth2()
    const loadClient = mockOnLoaded.mock.calls[0]?.[0]
    await loadClient()
    expect(mockInitTokenClient).not.toHaveBeenCalled()
  })
})
