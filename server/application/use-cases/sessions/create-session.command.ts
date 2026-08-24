import type { Clock, UseCase } from '../shared/contracts'
import type {
  IdentityClaims,
  SessionStore,
  SessionUser,
  TokenGenerator,
} from './session.contracts'

export class CreateSessionCommand implements UseCase<
  { credential: string },
  { user: SessionUser; expiresAt: string; rawToken: string; csrfToken: string }
> {
  constructor(
    private readonly verify: (credential: string) => Promise<IdentityClaims>,
    private readonly store: SessionStore,
    private readonly tokens: TokenGenerator,
    private readonly clock: Clock,
  ) {}

  async execute({ credential }: { credential: string }) {
    const claims = await this.verify(credential)
    const nowDate = this.clock.now()
    const now = nowDate.toISOString()
    const rawToken = this.tokens.sessionToken()
    const csrfToken = this.tokens.csrfToken()
    const expiresAt = new Date(
      nowDate.getTime() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString()
    await this.store.create({
      claims,
      sessionId: await this.tokens.hash(rawToken),
      csrfToken,
      now,
      expiresAt,
    })
    return {
      user: {
        id: claims.sub,
        email: claims.email,
        name: claims.name,
        picture: claims.picture,
        isUniversityEmail: claims.hd === 'uni.edu.pe',
      },
      expiresAt,
      rawToken,
      csrfToken,
    }
  }
}
