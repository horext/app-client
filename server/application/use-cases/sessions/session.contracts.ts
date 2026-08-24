export interface IdentityClaims {
  sub: string
  email: string
  name?: string
  picture?: string
  hd?: string
}

export interface SessionUser {
  id: string
  email: string
  name?: string
  picture?: string
  isUniversityEmail: boolean
}

export interface SessionStore {
  create(input: {
    claims: IdentityClaims
    sessionId: string
    csrfToken: string
    now: string
    expiresAt: string
  }): Promise<void>
  delete(sessionId: string): Promise<void>
}

export interface TokenGenerator {
  sessionToken(): string
  csrfToken(): string
  hash(value: string): Promise<string>
}
