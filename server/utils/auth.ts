import type { _RequestMiddleware, EventHandlerRequest, H3Event } from 'h3'
import { useJwtClient } from '../provider/jwt.client.provider'
import type { JwtPayload } from 'jsonwebtoken'

export const AUTHORIZATION_HEADER = 'Authorization'
export const AUTHORIZATION_PATTERN = new RegExp(
  '^Bearer (?<token>[a-zA-Z0-9-._~+/]+=*)$',
  'i',
)

export const authorizeEventRequest: _RequestMiddleware<
  EventHandlerRequest
> = async (event) => {
  const authHeader = getAuthorizationHeader(event.headers)
  if (!authHeader) {
    throw createError({
      status: 401,
    })
  }

  const token = extractTokenFromAuthHeader(authHeader)

  if (!token) {
    throw createError({
      status: 401,
    })
  }
  try {
    const client = useJwtClient(event)
    const payload = await client.verify(token)

    event.context.user = payload
  } catch (e: unknown) {
    throw createError({
      status: 401,
      cause: e,
    })
  }
}

export function extractTokenFromAuthHeader(authHeader: string) {
  return AUTHORIZATION_PATTERN.exec(authHeader)?.groups?.token
}

export function getAuthorizationHeader(headers: Headers) {
  return headers.get(AUTHORIZATION_HEADER)
}

export function getAuthenticatedUser(
  event: H3Event<EventHandlerRequest>,
): JwtPayload {
  if ('user' in event.context) {
    return event.context.user
  } else {
    throw createError({
      status: 401,
    })
  }
}
