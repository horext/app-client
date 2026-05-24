import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

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

const mockTokenClient = ref<unknown>(null)
const mockTokenResponse = ref<{
  access_token: string
  expires_in: string
} | null>(null)
const mockExpiresAt = ref<number | null>(null)
const mockIsPendingClient = ref(false)
const mockIsPendingToken = ref(false)
const mockIsSignedIn = ref(false)

mockNuxtImport('useGoogleAccounts', () =>
  vi.fn(() => ({
    onLoaded: mockOnLoaded,
  })),
)

mockNuxtImport('useRuntimeConfig', () => mockUseRuntimeConfig)

mockNuxtImport('useGoogleOAuth2Store', () =>
  vi.fn(() => ({
    tokenClient: mockTokenClient,
    tokenResponse: mockTokenResponse,
    expiresAt: mockExpiresAt,
    isPendingClient: mockIsPendingClient,
    isPendingToken: mockIsPendingToken,
    isSignedIn: mockIsSignedIn,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

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
    vi.clearAllMocks()
    mockTokenClient.value = null
    mockTokenResponse.value = null
    mockExpiresAt.value = null
    mockIsPendingClient.value = false
    mockIsPendingToken.value = false
    mockIsSignedIn.value = false
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
    mockTokenClient.value = { requestAccessToken }
    const { getToken } = useGoogleOAuth2()
    getToken()
    expect(mockIsPendingToken.value).toBe(true)
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
    mockTokenResponse.value = fakeResponse
    const { signOut } = useGoogleOAuth2()
    await signOut()
    expect(mockRevoke).toHaveBeenCalled()
    expect(mockTokenResponse.value).toBeNull()
  })

  it('signOut does nothing when tokenResponse is null', async () => {
    mockTokenResponse.value = null
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
    expect(mockIsPendingClient.value).toBe(false)
  })

  it('loadClient does not reinitialize if tokenClient already exists', async () => {
    mockTokenClient.value = { requestAccessToken: vi.fn() }
    useGoogleOAuth2()
    const loadClient = mockOnLoaded.mock.calls[0]?.[0]
    await loadClient()
    expect(mockInitTokenClient).not.toHaveBeenCalled()
  })
})
