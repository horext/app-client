import { afterEach, describe, expect, it, vi } from 'vitest'
import { AcademicConfigSyncApiGateway } from '../academic-config-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('AcademicConfigSyncApiGateway', () => {
  it('Given the academic config gateway, when the singleton is read, then it targets the academic config endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({})
    await new AcademicConfigSyncApiGateway().get()
    expect(fetch).toHaveBeenCalledWith('/api/v1/academic-config')
  })
})
