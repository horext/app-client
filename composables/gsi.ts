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
      src: 'https://accounts.google.com/gsi/client',
      defer: true,
      key: 'google-accounts',
    },
    {
      use: () => ({ google: window.google }),
    },
  )
}
