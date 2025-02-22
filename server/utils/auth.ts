import jwt from 'jsonwebtoken'
import type { _RequestMiddleware, EventHandlerRequest } from 'h3'
import { useJwksClient } from '../provider/jwks.client.provider'

export const AUTHORIZATION_HEADER = 'Authorization'
export const AUTHORIZATION_PATTERN = new RegExp(
    '^Bearer (?<token>[a-zA-Z0-9-._~+/]+=*)$',
    'i',
)

export const authorizeEventRequest: _RequestMiddleware<EventHandlerRequest> = async (
    event,
) => {
    const authHeader = event.headers.get(AUTHORIZATION_HEADER)
    if (!authHeader) {
        throw createError({
            status: 401,
        })
    }

    const token = AUTHORIZATION_PATTERN.exec(authHeader)?.groups?.token

    if (!token) {
        throw createError({
            status: 401,
        })
    }

    const { auth } = useRuntimeConfig(event)

    try {
        const client = useJwksClient(event)
        jwt.verify(token, client.getKey, {
            algorithms: ['RS256'],
            audience: auth.audience,
            issuer: auth.issuer,
        })
    } catch (e) {
        throw createError({
            status: 401,
        })
    }
}
