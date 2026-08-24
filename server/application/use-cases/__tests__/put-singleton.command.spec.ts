import { describe, expect, it, vi } from 'vitest'
import { CreateSingletonCommand } from '../singletons'

const clock = { now: () => new Date('2026-08-10T00:00:00.000Z') }

describe('CreateSingletonCommand', () => {
  it('delegates creation to the service', async () => {
    const create = vi.fn().mockResolvedValue({ facultyId: 1 })
    const command = new CreateSingletonCommand(
      'profile',
      { create },
      { get: vi.fn().mockResolvedValue(1) },
      clock,
    )

    await command.execute({ userId: 'user-1', value: { facultyId: 1 } })

    expect(create).toHaveBeenCalledWith('user-1', { facultyId: 1 })
  })
})
