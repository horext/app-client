
// Client ID and API key from the Developer Console
export const CLIENT_ID: string|undefined = process.env.NUXT_ENV_GOOGLE_CLIENT_ID || ''
export const API_KEY: string|undefined = process.env.NUXT_ENV_GOOGLE_API_KEY || ''
// Array of API discovery doc URLs for APIs used by the quickstart
export const DISCOVERY_DOCS = (process.env.NUXT_ENV_GOOGLE_DISCOVERY_DOCS || '').split(',')
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const SCOPES: string|undefined = process.env.NUXT_ENV_GOOGLE_SCOPES || ''
