import { makeUUID } from '~~/shared/domain/types/ids'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { IScheduleFavorite } from '#shared/domain/types/schedule'
import { FavoritesSyncApiGateway } from '../favorites-sync-api.gateway'
import { installFetchMock } from './http-test-fixtures'

afterEach(() => vi.unstubAllGlobals())
describe('FavoritesSyncApiGateway', () => {
  it('Given a favorite, when it is created, then the request contains its schedule identity', async () => {
    const { raw } = installFetchMock()
    raw.mockResolvedValue({ headers: new Headers() })
    const timestamp = '2026-01-01T00:00:00.000Z'
    const favorite: IScheduleFavorite = {
      id: makeUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: 'user-1',
      updatedBy: 'user-1',
    }
    await new FavoritesSyncApiGateway().create(favorite, 'operation-1')
    expect(raw).toHaveBeenCalledWith(
      '/api/v1/favorites',
      expect.objectContaining({ body: { scheduleId: favorite.id } }),
    )
  })
})
