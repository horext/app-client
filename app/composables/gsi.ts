/// <reference types="google.accounts" />

import type { UseScriptContext } from "@unhead/vue"

export interface GoogleAccountsLoaderApi {
  google: {
    accounts: typeof google.accounts
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends GoogleAccountsLoaderApi {}
}

export function useGoogleAccounts(): UseScriptContext<GoogleAccountsLoaderApi> {
  return useScript<GoogleAccountsLoaderApi>(
    {
      key: 'google-accounts',
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      crossorigin: false,
    },
    {
      use: () => ({ google: window.google }),
      trigger: 'onNuxtReady',
    },
  )
}
