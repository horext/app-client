import { eq, lte } from 'drizzle-orm'
import type {
  IdentityClaims,
  SessionStore,
} from '../../../application/use-cases/sessions'
import { sessions, users } from '../../../database/schema'
import type { HorextDatabase } from '../../../database/client'

export class DrizzleSessionStore implements SessionStore {
  constructor(private readonly database: HorextDatabase) {}

  async create(input: {
    claims: IdentityClaims
    sessionId: string
    csrfToken: string
    now: string
    expiresAt: string
  }): Promise<void> {
    const { claims, sessionId, csrfToken, now, expiresAt } = input
    await this.database.batch([
      this.database
        .insert(users)
        .values({
          id: claims.sub,
          email: claims.email,
          name: claims.name ?? null,
          picture: claims.picture ?? null,
          isUniversityEmail: claims.hd === 'uni.edu.pe',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: claims.email,
            name: claims.name ?? null,
            picture: claims.picture ?? null,
            isUniversityEmail: claims.hd === 'uni.edu.pe',
            updatedAt: now,
          },
        }),
      this.database.insert(sessions).values({
        id: sessionId,
        userId: claims.sub,
        csrfToken,
        expiresAt,
        createdAt: now,
      }),
      this.database.delete(sessions).where(lte(sessions.expiresAt, now)),
    ])
  }

  async delete(sessionId: string): Promise<void> {
    await this.database.delete(sessions).where(eq(sessions.id, sessionId))
  }
}
