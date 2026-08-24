import { and, eq, gt } from 'drizzle-orm'
import { useOrm } from '../database/client'
import { sessions, users } from '../database/schema'
import type { AuthContext } from './cloud-types'
import { sha256 } from './db'
import { createError, type H3Event } from 'h3'

export const SESSION_COOKIE = 'horext_session'
export const CSRF_COOKIE = 'horext_csrf'

export async function requireAuth(event: H3Event): Promise<AuthContext> {
  const rawToken = getCookie(event, SESSION_COOKIE)
  if (!rawToken)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication is required.',
      data: { code: 'authentication-required' },
    })
  const orm = useOrm(event)
  const [sessionRow] = await orm
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, await sha256(rawToken)),
        gt(sessions.expiresAt, new Date().toISOString()),
      ),
    )
    .limit(1)
  if (!sessionRow) {
    deleteCookie(event, SESSION_COOKIE)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'The session is invalid or expired.',
      data: { code: 'invalid-session' },
    })
  }
  const [userRow] = await orm
    .select()
    .from(users)
    .where(eq(users.id, sessionRow.userId))
    .limit(1)
  if (!userRow)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'The account no longer exists.',
      data: { code: 'invalid-session' },
    })
  return {
    session: {
      id: sessionRow.id,
      user_id: sessionRow.userId,
      csrf_token: sessionRow.csrfToken,
      expires_at: sessionRow.expiresAt,
      created_at: sessionRow.createdAt,
    },
    user: {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      picture: userRow.picture,
      is_university_email: userRow.isUniversityEmail ? 1 : 0,
      created_at: userRow.createdAt,
      updated_at: userRow.updatedAt,
    },
  }
}
export async function requireCsrf(
  event: H3Event,
  auth?: AuthContext,
): Promise<AuthContext> {
  const context = auth ?? (await requireAuth(event)),
    header = getHeader(event, 'x-csrf-token'),
    cookie = getCookie(event, CSRF_COOKIE)
  if (
    !header ||
    !cookie ||
    header !== cookie ||
    header !== context.session.csrf_token
  )
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'The CSRF token is missing or invalid.',
      data: { code: 'invalid-csrf-token' },
    })
  return context
}
export function sessionCookieOptions(
  maxAge = 60 * 60 * 24 * 14,
): NonNullable<Parameters<typeof setCookie>[3]> {
  return {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}
export function csrfCookieOptions(
  maxAge = 60 * 60 * 24 * 14,
): NonNullable<Parameters<typeof setCookie>[3]> {
  return {
    httpOnly: false,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}
