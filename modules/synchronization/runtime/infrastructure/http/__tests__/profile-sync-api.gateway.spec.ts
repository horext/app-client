import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProfileSyncApiGateway } from '../profile-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('ProfileSyncApiGateway', () => {
  it('Given the profile gateway, when the singleton is read, then it targets the profile endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({})
    await new ProfileSyncApiGateway().get()
    expect(fetch).toHaveBeenCalledWith('/api/v1/profile')
  })
})
