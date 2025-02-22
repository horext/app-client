import type { H3Event, EventHandlerRequest } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { IJwtClient} from '../clients/jwt.client';
import { JwtClient } from '../clients/jwt.client'
import { JwksClient } from 'jwks-rsa'
import { createLazySingleton } from './provider'

export const useJwtClient = createLazySingleton(
  (event: H3Event<EventHandlerRequest>): IJwtClient => {
    const { auth } = useRuntimeConfig(event)
    return new JwtClient(
      {
        audience: auth.audience,
        issuer: auth.issuer,
      },
      new JwksClient({
        jwksUri: auth.jwksUri,
      }),
    )
  },
)
