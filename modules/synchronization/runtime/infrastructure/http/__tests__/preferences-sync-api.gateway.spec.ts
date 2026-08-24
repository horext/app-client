import { afterEach, describe, expect, it, vi } from 'vitest'
import { PreferencesSyncApiGateway } from '../preferences-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('PreferencesSyncApiGateway', () => {
  it('Given the preferences gateway, when the singleton is read, then it targets the preferences endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({})
    await new PreferencesSyncApiGateway().get()
    expect(fetch).toHaveBeenCalledWith('/api/v1/preferences')
  })
})
