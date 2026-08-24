import { describe, expect, it, vi } from 'vitest'
import {
  SyncOperation,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import { ActivityPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'
import { activity } from '../../../infrastructure/repositories/__tests__/repository-test-fixtures'
import {
  createOperation,
  deleteOperation,
  pages,
  updateOperation,
} from '../aggregate-sync.use-case'

describe('aggregate sync helpers', () => {
  const data = {
    ...ActivityPersistenceMapper.toRecord(activity()),
    revision: 2,
  }

  it('Given aggregate records, when write operations are built, then create, update, and delete commands preserve identity', () => {
    expect(
      createOperation(SyncResource.ACTIVITIES, { id: data.id, data }),
    ).toMatchObject({ operation: SyncOperation.CREATE, revision: 2 })
    expect(
      updateOperation(SyncResource.ACTIVITIES, { id: data.id, data }),
    ).toMatchObject({ operation: SyncOperation.UPDATE, revision: 2 })
    expect(deleteOperation(SyncResource.ACTIVITIES, 'item-1', 3)).toMatchObject(
      { operation: SyncOperation.DELETE, revision: 3 },
    )
  })

  it('Given a paginated aggregate gateway, when all records are pulled, then every cursor page is collected', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({
        items: [{ id: 'a', data, revision: 1, createdAt: '', updatedAt: '' }],
        nextCursor: 'next',
      })
      .mockResolvedValueOnce({
        items: [{ id: 'b', data, revision: 2, createdAt: '', updatedAt: '' }],
        nextCursor: null,
      })
    await expect(pages(fetchPage)).resolves.toHaveLength(2)
    expect(fetchPage).toHaveBeenNthCalledWith(2, 'next')
  })
})
