import { sessionUseCases } from '../../../application/composition'
import {
  CSRF_COOKIE,
  csrfCookieOptions,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '../../../utils/auth'
import { createError, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ credential?: unknown }>(event)
  if (typeof body?.credential !== 'string' || body.credential.length > 16_384)
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Content',
      message: 'A Google credential is required.',
      data: {
        code: 'credential-required',
        errors: { credential: ['Expected a Google ID credential.'] },
      },
    })
  const result = await sessionUseCases(event).create.execute({
    credential: body.credential,
  })
  setCookie(event, SESSION_COOKIE, result.rawToken, sessionCookieOptions())
  setCookie(event, CSRF_COOKIE, result.csrfToken, csrfCookieOptions())
  setResponseStatus(event, 201)
  setResponseHeader(event, 'location', '/api/v1/sessions/current')
  return {
    user: result.user,
    expiresAt: result.expiresAt,
  }
})
