import type { H3Event, EventHandlerRequest } from 'h3'
import { useRuntimeConfig } from '#imports'
import { JwtClient } from '../clients/jwt.client'
import { JwksClient } from 'jwks-rsa'

let jwksClientInstance: JwtClient | null = null

export const useJwtClient = (
    event: H3Event<EventHandlerRequest>,
): JwtClient => {
    if (jwksClientInstance) {
        return jwksClientInstance
    }
    const { auth } = useRuntimeConfig(event)
    const jwksClient = new JwtClient(
        {
            audience: auth.audience,
            issuer: auth.issuer,
        },
        new JwksClient({
            jwksUri: auth.jwksUri,
        }),
    )
    jwksClientInstance = jwksClient
    return jwksClient
}
