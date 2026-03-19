import { defineStore } from 'pinia'

export const useGoogleOAuth2Store = defineStore('google-oauth2', () => {
  const tokenClient = shallowRef<google.accounts.oauth2.TokenClient>()
  const tokenResponse = shallowRef<google.accounts.oauth2.TokenResponse | null>(null)
  const expiresAt = ref<number | null>(null)
  const isPendingClient = ref(false)
  const isPendingToken = ref(false)

  const isSignedIn = computed(() => !!tokenResponse.value)

  return {
    tokenClient,
    tokenResponse,
    expiresAt,
    isPendingClient,
    isPendingToken,
    isSignedIn,
  }
})
