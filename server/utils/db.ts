import type { CloudflareD1Database } from './cloud-types'
import { createError, type H3Event } from 'h3'

export function useDatabase(event: H3Event): CloudflareD1Database {
  const db = event.context.cloudflare?.env?.DB
  if (!db) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'Cloud storage is not configured.',
      data: { code: 'database-unavailable' },
    })
  }
  return db
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  )
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
