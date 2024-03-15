/// <reference types="google.accounts" />

import { useScript } from '@unhead/vue'

export interface GoogleAccountsLoaderApi {
  google: {
    accounts: typeof google.accounts
  }
}

declare global {
  interface Window extends GoogleAccountsLoaderApi {}
}

export function useGoogleAccounts() {
  return useScript<GoogleAccountsLoaderApi>(
    {
      key: 'google-accounts',
      src: 'https://accounts.google.com/gsi/client',
    },
    {
      use: () => ({ google: window.google }),
      trigger: 'idle',
    },
  )
}
