import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  IndexedDbAggregatePersistence,
  type AggregatePersistence,
} from '../aggregate-persistence'
import { StoresDB } from '../../context/db'

describe('IndexedDbAggregatePersistence', () => {
  const get = vi.fn()
  const getAll = vi.fn()
  const put = vi.fn()
  const remove = vi.fn()
  const transaction = vi.fn()
  const objectStore = vi.fn()
  const index = vi.fn()
  const getFromIndex = vi.fn()
  const db = {
    transaction,
    getFromIndex,
    put,
    delete: remove,
  }
  let persistence: AggregatePersistence

  beforeEach(() => {
    get.mockReset()
    getAll.mockReset()
    put.mockReset()
    remove.mockReset()
    transaction.mockReset()
    objectStore.mockReset()
    index.mockReset()
    getFromIndex.mockReset()
    persistence = new IndexedDbAggregatePersistence(
      vi.fn().mockResolvedValue(db),
    )
    transaction.mockReturnValue({ objectStore })
    objectStore.mockReturnValue({ get, index })
    index.mockReturnValue({ getAll })
    get.mockResolvedValue(undefined)
    getAll.mockResolvedValue([])
    getFromIndex.mockResolvedValue(undefined)
    put.mockResolvedValue(undefined)
    remove.mockResolvedValue(undefined)
  })

  it('finds an entity using the compound user and entity key', async () => {
    get.mockResolvedValue({ id: 'profile', createdBy: 'user-1' })

    await expect(
      persistence.find(StoresDB.PROFILE, 'user-1', 'profile'),
    ).resolves.toEqual({
      id: 'profile',
      createdBy: 'user-1',
    })
    expect(transaction).toHaveBeenCalledWith('profile', 'readonly')
    expect(get).toHaveBeenCalledWith(['user-1', 'profile'])
  })

  it('lists only entities owned by the requested user', async () => {
    getAll.mockResolvedValue([{ id: 'profile', createdBy: 'user-1' }])
    const globalScope = globalThis as typeof globalThis & {
      IDBKeyRange?: unknown
    }
    const originalKeyRange = globalScope.IDBKeyRange
    Object.defineProperty(globalScope, 'IDBKeyRange', {
      configurable: true,
      value: { only: (key: IDBValidKey) => key },
    })
    try {
      await expect(
        persistence.findAll(StoresDB.PROFILE, 'user-1'),
      ).resolves.toEqual([{ id: 'profile', createdBy: 'user-1' }])
      expect(index).toHaveBeenCalledWith('createdBy')
      expect(getAll).toHaveBeenCalledWith('user-1')
    } finally {
      if (originalKeyRange === undefined) {
        delete (globalScope as { IDBKeyRange?: unknown }).IDBKeyRange
      } else {
        globalScope.IDBKeyRange = originalKeyRange
      }
    }
  })

  it('stamps ownership and timestamps when creating', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-02T03:04:05.000Z'))
    const value = { id: 'profile', facultyId: 1 }

    await expect(
      persistence.create(StoresDB.PROFILE, value as never, 'user-1'),
    ).resolves.toEqual({
      ...value,
      createdAt: '2026-01-02T03:04:05.000Z',
      updatedAt: '2026-01-02T03:04:05.000Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
    })
    expect(put).toHaveBeenCalledWith(
      StoresDB.PROFILE,
      expect.objectContaining({ createdBy: 'user-1' }),
    )
    vi.useRealTimers()
  })

  it('updates metadata while preserving the original creator', async () => {
    const value = {
      id: 'profile',
      facultyId: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      createdBy: 'user-1',
    }

    const result = await persistence.update(
      StoresDB.PROFILE,
      value as never,
      'user-2',
    )

    expect(result).toMatchObject({
      ...value,
      createdBy: 'user-1',
      updatedBy: 'user-2',
    })
    expect(put).toHaveBeenCalledWith(StoresDB.PROFILE, result)
  })

  it('removes only the requested user entity', async () => {
    await persistence.remove(StoresDB.PROFILE, 'user-1', 'profile')
    expect(remove).toHaveBeenCalledWith(StoresDB.PROFILE, ['user-1', 'profile'])
  })
})
