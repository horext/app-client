import type { D1Database } from '@cloudflare/workers-types'

declare module 'h3' {
  interface H3EventContext {
    cloudflare?: {
      env?: {
        DB?: D1Database
      }
    }
    requestId?: string
  }
}

export {}
