import { describe, expect, it, vi } from 'vitest'
import { CreateResourceCommand, GetResourceQuery } from '../resources'
import { ResourceNotFoundError } from '../shared/errors'

const clock = { now: () => new Date('2026-08-10T00:00:00.000Z') }

describe('resource use cases', () => {
  it('returns an entity with its persistence revision', async () => {
    const query = new GetResourceQuery(
      'activity',
      {
        get: vi.fn().mockResolvedValue({
          id: 'activity-1',
          toSnapshot: () => ({ title: 'Math' }),
        }),
      },
      { get: vi.fn().mockResolvedValue(3) },
      clock,
    )

    const result = await query.execute({ userId: 'user-1', id: 'activity-1' })

    expect(result.revision).toBe(3)
    expect(result.record).toMatchObject({
      id: 'activity-1',
      data: { title: 'Math' },
      revision: 3,
    })
  })

  it('reports a missing entity as an application error', async () => {
    const query = new GetResourceQuery(
      'activity',
      { get: vi.fn().mockResolvedValue(undefined) },
      { get: vi.fn() },
      clock,
    )

    await expect(
      query.execute({ userId: 'user-1', id: 'activity-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('replays an idempotent create without writing again', async () => {
    const create = vi.fn()
    const cached = {
      id: 'activity-1',
      data: { title: 'Math' },
      revision: 1,
      createdAt: '2026-08-10T00:00:00.000Z',
      updatedAt: '2026-08-10T00:00:00.000Z',
      deletedAt: null,
    }
    const command = new CreateResourceCommand(
      'activity',
      { create },
      { get: vi.fn() },
      {
        find: vi.fn().mockResolvedValue(cached),
        store: vi.fn(),
      },
      clock,
      (id) => `/api/v1/activities/${id}`,
    )

    const result = await command.execute({
      userId: 'user-1',
      value: { title: 'Math' },
      operationId: 'operation-1',
    })

    expect(result).toMatchObject({ replayed: true, status: 201 })
    expect(create).not.toHaveBeenCalled()
  })
})
