import type {
  IGoogleCalendarItem,
  IGoogleCalendarListPayload,
} from '~/interfaces/google/calendar'

export const useGoogleOAuth2 = () => {
  const { $script } = useGoogleAccounts()
  const config = useRuntimeConfig()

  const tokenClient = ref<google.accounts.oauth2.TokenClient>()

  const loadClient = async () => {
    try {
      const gsi = config.public.gsi
      const client = google.accounts.oauth2.initTokenClient({
        client_id: gsi.clientId,
        scope: gsi.scopes,
        callback: handleTokenResponse,
      })
      tokenClient.value = client
      console.log('Google script loaded', client)
    } catch (error) {
      console.error('Error loading Google script', error)
    }
  }
  onMounted(() => {
    $script.then(loadClient)
  })

  const tokenResponse = shallowRef<google.accounts.oauth2.TokenResponse | null>(
    null,
  )
  async function handleTokenResponse(
    response: google.accounts.oauth2.TokenResponse,
  ) {
    tokenResponse.value = response
    expiresAt.value = Number(response.expires_in) * 1000 + Date.now()
  }
  const getToken = async () => {
    tokenClient.value?.requestAccessToken()
  }
  const revokeToken = async (
    tokenResponse: google.accounts.oauth2.TokenResponse,
  ) => {
    google.accounts.oauth2.revoke(tokenResponse.access_token, () => {
      console.log('Token revoked')
    })
  }

  const googleApis = $fetch.create({
    method: 'GET',
    baseURL: 'https://www.googleapis.com/',
    onRequest: (config) => {
      const accessToken = tokenResponse.value?.access_token
      const isExpired = expiresAt.value && expiresAt.value < Date.now()
      if (isExpired) {
        getToken()
      }
      if (accessToken) {
        config.options.headers = {
          ...config.options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }
    },
  })

  async function fetchCalendars() {
    return await googleApis<IGoogleCalendarListPayload>(
      'calendar/v3/users/me/calendarList',
    )
  }

  async function createCalendar({
    summary,
  }: Pick<IGoogleCalendarItem, 'summary'>): Promise<IGoogleCalendarItem> {
    const response = await googleApis<IGoogleCalendarItem>(
      'calendar/v3/calendars',
      {
        method: 'POST',
        body: { summary },
      },
    )
    return response
  }

  async function createEvent(calendarId: string, event: object) {
    const response = await googleApis(
      `calendar/v3/calendars/${calendarId}/events`,
      {
        method: 'POST',
        body: event,
      },
    )
    return response
  }

  const isSignedIn = computed(() => !!tokenResponse.value)

  const expiresAt = ref<number | null>(null)

  const signOut = () => {
    if (tokenResponse.value) {
      revokeToken(tokenResponse.value)
      tokenResponse.value = null
    }
  }

  return {
    accessToken: tokenResponse,
    getToken,
    revokeToken,
    googleApis,
    isSignedIn,
    signOut,
    tokenClient,
    fetchCalendars,
    createCalendar,
    createEvent,
  }
}
