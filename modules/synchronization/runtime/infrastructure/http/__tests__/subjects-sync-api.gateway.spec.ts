import { afterEach, describe, expect, it, vi } from 'vitest'
import { SubjectsSyncApiGateway } from '../subjects-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('SubjectsSyncApiGateway', () => {
  it('Given the subjects gateway, when records are listed, then it targets the subjects endpoint', async () => {
    const { fetch } = installFetchMock()
    fetch.mockResolvedValue({ items: [], nextCursor: null })
    await new SubjectsSyncApiGateway().list()
    expect(fetch).toHaveBeenCalledWith('/api/v1/subjects', expect.any(Object))
  })
})
