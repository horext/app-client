/// <reference types="google.accounts" />

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
      async: true,
      //@ts-ignore
      crossorigin: false,
    },
    {
      use: () => ({ google: window.google }),
    },
  )
}
