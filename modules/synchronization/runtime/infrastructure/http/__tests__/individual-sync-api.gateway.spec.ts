import { makeUUID } from '~~/shared/domain/types/ids'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { IProfile } from '#shared/domain/types/profile'
import { ProfileSyncApiGateway } from '../profile-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())

describe('IndividualSyncGateway', () => {
  it('Given a singleton gateway, when reading and mutating a profile, then it uses the singleton endpoint', async () => {
    const { fetch, raw } = installFetchMock()
    fetch.mockResolvedValue({})
    raw.mockResolvedValue({ headers: new Headers() })
    const gateway = new ProfileSyncApiGateway()
    const timestamp = '2026-01-01T00:00:00.000Z'
    const profile: IProfile = {
      id: makeUUID(),
      facultyId: 1,
      specialityId: 2,
      setupCompleted: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: 'user-1',
      updatedBy: 'user-1',
    }

    await gateway.get()
    await gateway.create(profile, 'operation-1')
    await gateway.update(profile, 3)

    expect(fetch).toHaveBeenCalledWith('/api/v1/profile')
    expect(raw).toHaveBeenNthCalledWith(
      1,
      '/api/v1/profile',
      expect.objectContaining({ method: 'POST', body: profile }),
    )
    expect(raw).toHaveBeenNthCalledWith(
      2,
      '/api/v1/profile',
      expect.objectContaining({ method: 'PATCH' }),
    )
  })
})
