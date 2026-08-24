import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActivitiesSyncApiGateway } from '../activities-sync-api.gateway'
import { activitySnapshot, installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())

describe('CollectionSyncGateway', () => {
  it('Given a collection gateway, when listing and mutating records, then it sends the expected HTTP requests', async () => {
    const { fetch, raw } = installFetchMock()
    fetch.mockResolvedValue({ items: [], nextCursor: null })
    raw.mockResolvedValue({ headers: new Headers() })
    const gateway = new ActivitiesSyncApiGateway()
    const activity = activitySnapshot()

    await gateway.list('cursor-1')
    await gateway.create(activity, 'operation-1')
    await gateway.update(activity, 4)
    await gateway.delete(activity.id, 5)

    expect(fetch).toHaveBeenCalledWith('/api/v1/activities', {
      query: { cursor: 'cursor-1', limit: 500 },
    })
    expect(raw).toHaveBeenNthCalledWith(
      1,
      '/api/v1/activities',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({ externalId: activity.id }),
      }),
    )
    expect(raw).toHaveBeenNthCalledWith(
      2,
      `/api/v1/activities/${activity.id}`,
      expect.objectContaining({ method: 'PATCH' }),
    )
    expect(raw).toHaveBeenNthCalledWith(
      3,
      `/api/v1/activities/${activity.id}`,
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
