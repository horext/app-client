import { describe, expect, it, vi } from 'vitest'
import { CreateFavoriteCommand } from '../favorites'
import { PatchItemCommand } from '../resources'
import { MissingReferenceError, ResourceNotFoundError } from '../shared/errors'

const clock = { now: () => new Date('2026-08-10T00:00:00.000Z') }

describe('item write use cases', () => {
  it('does not patch a missing resource', async () => {
    const patch = vi
      .fn()
      .mockRejectedValue(new ResourceNotFoundError('schedule'))
    const command = new PatchItemCommand(
      'schedule',
      {
        get: vi.fn().mockResolvedValue(undefined),
        create: vi.fn(),
        patch,
        delete: vi.fn(),
        snapshot: (value) => value,
        id: vi.fn(),
      },
      { get: vi.fn() },
      clock,
    )

    await expect(
      command.execute({
        userId: 'user-1',
        id: 'schedule-1',
        value: {},
        revision: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
    expect(patch).toHaveBeenCalledOnce()
  })

  it('rejects a favorite whose schedule is missing', async () => {
    const create = vi.fn()
    const command = new CreateFavoriteCommand(
      {
        get: vi.fn().mockResolvedValue(undefined),
        scheduleExists: vi.fn().mockResolvedValue(false),
        create,
        snapshot: (value) => value,
      },
      { get: vi.fn() },
      clock,
    )

    await expect(
      command.execute({ userId: 'user-1', id: 'schedule-1' }),
    ).rejects.toBeInstanceOf(MissingReferenceError)
    expect(create).not.toHaveBeenCalled()
  })
})
