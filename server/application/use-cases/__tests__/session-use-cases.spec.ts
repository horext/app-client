import { describe, expect, it, vi } from 'vitest'
import { CreateSessionCommand } from '../sessions'

describe('CreateSessionCommand', () => {
  it('verifies the identity and persists a fourteen day session', async () => {
    const create = vi.fn().mockResolvedValue(undefined)
    const command = new CreateSessionCommand(
      vi.fn().mockResolvedValue({
        sub: 'user-1',
        email: 'student@uni.edu.pe',
        name: 'Student',
        hd: 'uni.edu.pe',
      }),
      { create, delete: vi.fn() },
      {
        sessionToken: () => 'raw-token',
        csrfToken: () => 'csrf-token',
        hash: vi.fn().mockResolvedValue('hashed-token'),
      },
      { now: () => new Date('2026-08-10T00:00:00.000Z') },
    )

    const result = await command.execute({ credential: 'credential' })

    expect(result).toEqual({
      user: {
        id: 'user-1',
        email: 'student@uni.edu.pe',
        name: 'Student',
        picture: undefined,
        isUniversityEmail: true,
      },
      expiresAt: '2026-08-24T00:00:00.000Z',
      rawToken: 'raw-token',
      csrfToken: 'csrf-token',
    })
    expect(create).toHaveBeenCalledWith({
      claims: expect.objectContaining({ sub: 'user-1' }),
      sessionId: 'hashed-token',
      csrfToken: 'csrf-token',
      now: '2026-08-10T00:00:00.000Z',
      expiresAt: '2026-08-24T00:00:00.000Z',
    })
  })
})
