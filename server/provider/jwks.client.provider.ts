import type { H3Event, EventHandlerRequest } from "h3"
import { useRuntimeConfig } from "#imports"
import { CustomJwksClient } from "../clients/jwks.client"

let jwksClientInstance: CustomJwksClient | null = null

export const useJwksClient = (event: H3Event<EventHandlerRequest>): CustomJwksClient => {
    if (jwksClientInstance) {
        return jwksClientInstance
    }
    const { auth } = useRuntimeConfig(event)
    const jwksClient = new CustomJwksClient({
        jwksUri: auth.jwksUri,
    })
    jwksClientInstance = jwksClient
    return jwksClient
}