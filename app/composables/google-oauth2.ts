import { ofetch } from 'ofetch'
import type {
  IGoogleCalendarItem,
  IGoogleCalendarListPayload,
} from '~/interfaces/google/calendar'

import type { CalendarEvent } from '~/models/google'

export const useGoogleOAuth2 = () => {
  const { onLoaded } = useGoogleAccounts()
  const config = useRuntimeConfig()
  const store = useGoogleOAuth2Store()
  const { tokenClient, tokenResponse, expiresAt, isPendingClient, isPendingToken, isSignedIn } = storeToRefs(store)

  const handleTokenResponse = (
    response: google.accounts.oauth2.TokenResponse,
  ) => {
    tokenResponse.value = response
    expiresAt.value = Number(response.expires_in) * 1000 + Date.now()
    isPendingToken.value = false
  }

  const loadClient = async () => {
    if (tokenClient.value) return
    isPendingClient.value = true
    try {
      const gsi = config.public.gsi
      const client = google.accounts.oauth2.initTokenClient({
        client_id: gsi.clientId,
        scope: gsi.scopes,
        callback: handleTokenResponse,
        error_callback: () => {
          isPendingToken.value = false
        },
      })
      tokenClient.value = markRaw(client)
    } catch (error) {
      console.error('Error loading Google script', error)
    } finally {
      isPendingClient.value = false
    }
  }

  const getToken = () => {
    isPendingToken.value = true
    tokenClient.value?.requestAccessToken()
  }

  const revokeToken = (
    response: google.accounts.oauth2.TokenResponse,
  ) => {
    google.accounts.oauth2.revoke(response.access_token, () => {})
  }

  const googleApis = ofetch.create({
    method: 'GET',
    baseURL: 'https://www.googleapis.com/',
    onRequest: ({ options }) => {
      const accessToken = tokenResponse.value?.access_token
      const isExpired = expiresAt.value && expiresAt.value < Date.now()
      if (isExpired) {
        getToken()
      }
      if (accessToken) {
        options.headers.set('Authorization', `Bearer ${accessToken}`)
      } else {
        console.warn('No access token')
      }
    },
  })

  onLoaded(loadClient)

  async function fetchCalendars() {
    return await googleApis<IGoogleCalendarListPayload>(
      'calendar/v3/users/me/calendarList',
    )
  }

  async function createCalendar({
    summary,
  }: Pick<IGoogleCalendarItem, 'summary'>): Promise<IGoogleCalendarItem> {
    return await googleApis<IGoogleCalendarItem>('calendar/v3/calendars', {
      method: 'POST',
      body: { summary },
    })
  }

  async function createEvent(calendarId: string, event: CalendarEvent) {
    return await googleApis(`calendar/v3/calendars/${calendarId}/events`, {
      method: 'POST',
      body: event.toRequest(),
    })
  }

  const signOut = async () => {
    if (tokenResponse.value) {
      await revokeToken(tokenResponse.value)
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
    isPendingClient,
    isPendingToken,
    fetchCalendars,
    createCalendar,
    createEvent,
  }
}

