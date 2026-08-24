import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulesSyncApiGateway } from '../schedules-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('SchedulesSyncApiGateway', () => {
  it('Given the schedules gateway, when records are listed, then it targets the schedules endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({ items: [], nextCursor: null })
    await new SchedulesSyncApiGateway().list()
    expect(fetch).toHaveBeenCalledWith('/api/v1/schedules', expect.any(Object))
  })
})
