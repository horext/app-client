import {
  CSRF_COOKIE,
  csrfCookieOptions,
  requireCsrf,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '../../../utils/auth'
import { sessionUseCases } from '../../../application/composition'
import { setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const { session } = await requireCsrf(event)
  await sessionUseCases(event).delete.execute({ sessionId: session.id })
  deleteCookie(event, SESSION_COOKIE, sessionCookieOptions(0))
  deleteCookie(event, CSRF_COOKIE, csrfCookieOptions(0))
  setResponseStatus(event, 204)
  return null
})
