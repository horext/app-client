import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActivitiesSyncApiGateway } from '../activities-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('ActivitiesSyncApiGateway', () => {
  it('Given the activities gateway, when records are listed, then it targets the activities endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({ items: [], nextCursor: null })
    await new ActivitiesSyncApiGateway().list()
    expect(fetch).toHaveBeenCalledWith('/api/v1/activities', expect.any(Object))
  })
})
