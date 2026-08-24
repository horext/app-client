import { describe, expect, it, vi } from 'vitest'
import { GetChangesQuery } from '../sync'

describe('GetChangesQuery', () => {
  it('groups hydrated changes and represents deletions with null data', async () => {
    const query = new GetChangesQuery({
      list: vi.fn(),
      changes: vi.fn().mockResolvedValue({
        rows: [
          {
            sequence: 4,
            resourceType: 'activities',
            recordId: 'activity-1',
            revision: 2,
            operation: 'upsert',
            changedAt: '2026-08-10T00:00:00.000Z',
          },
          {
            sequence: 5,
            resourceType: 'favorites',
            recordId: 'schedule-1',
            revision: 3,
            operation: 'delete',
            changedAt: '2026-08-10T00:01:00.000Z',
          },
        ],
        hasMore: true,
      }),
      find: vi
        .fn()
        .mockResolvedValueOnce({
          payload: '{"title":"Math"}',
          deleted_at: null,
        })
        .mockResolvedValueOnce({ payload: null, deleted_at: 'deleted' }),
    })

    const result = await query.execute({
      userId: 'user-1',
      cursor: 0,
      limit: 2,
    })

    expect(result.activities).toEqual([
      expect.objectContaining({ data: { title: 'Math' }, revision: 2 }),
    ])
    expect(result.favorites).toEqual([
      expect.objectContaining({ data: null, deletedAt: 'deleted' }),
    ])
    expect(result.hasMore).toBe(true)
  })
})
