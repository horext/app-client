import { afterEach, describe, expect, it, vi } from 'vitest'
import { GenerationsSyncApiGateway } from '../generations-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe(' GenerationsSyncApiGateway', () => {
  it('Given the generations gateway, when records are listed, then it targets the generations endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({ items: [], nextCursor: null })
    await new GenerationsSyncApiGateway().list()
    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/generations',
      expect.any(Object),
    )
  })
})
