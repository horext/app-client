import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AggregatePersistence } from '../aggregate-persistence'
import { IndexedDbAggregatePersistence } from '../indexed-db-aggregate-persistence'
import { StoresDB } from '../../context/db'
import { makeUUID } from '~~/shared/domain/types/ids'
import type { IProfile, ProfileId, ScheduleGenerateId } from '~~/shared/domain'

describe('IndexedDbAggregatePersistence', () => {
  const get = vi.fn()
  const getAll = vi.fn()
  const put = vi.fn()
  const remove = vi.fn()
  const transaction = vi.fn()
  const objectStore = vi.fn()
  const index = vi.fn()
  const getFromIndex = vi.fn()
  const add = vi.fn()
  const db = {
    transaction,
    getFromIndex,
    put,
    delete: remove,
    add,
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
    add.mockReset()
  })

  it('finds an entity using the compound user and entity key', async () => {
    const id: ProfileId = makeUUID()
    const stored = { id, createdBy: 'user-1' }
    get.mockResolvedValue(stored)

    await expect(
      persistence.find(StoresDB.PROFILE, 'user-1', id),
    ).resolves.toEqual(stored)
    expect(transaction).toHaveBeenCalledWith('profile', 'readonly')
    expect(get).toHaveBeenCalledWith(['user-1', id])
  })

  it('lists only entities owned by the requested user', async () => {
    getAll.mockResolvedValue([{ id: crypto.randomUUID(), createdBy: 'user-1' }])
    const originalKeyRange = globalThis.IDBKeyRange
    Object.defineProperty(globalThis, 'IDBKeyRange', {
      configurable: true,
      value: { only: (key: IDBValidKey) => key },
    })
    try {
      await expect(
        persistence.findAll(StoresDB.PROFILE, 'user-1'),
      ).resolves.toHaveLength(1)
      expect(index).toHaveBeenCalledWith('createdBy')
      expect(getAll).toHaveBeenCalledWith('user-1')
    } finally {
      if (originalKeyRange === undefined) {
        Reflect.deleteProperty(globalThis, 'IDBKeyRange')
      } else {
        Object.defineProperty(globalThis, 'IDBKeyRange', {
          configurable: true,
          value: originalKeyRange,
        })
      }
    }
  })

  it('stamps ownership and timestamps when creating', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-02T03:04:05.000Z'))
    const value = { facultyId: 1, specialityId: 2, setupCompleted: false }

    await expect(
      persistence.create(StoresDB.PROFILE, value, 'user-1'),
    ).resolves.toEqual({
      ...value,
      createdAt: '2026-01-02T03:04:05.000Z',
      updatedAt: '2026-01-02T03:04:05.000Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
      id: expect.any(String),
    })
    vi.useRealTimers()
  })

  it('preserves an id supplied by the domain', async () => {
    const favoritePersistence = new IndexedDbAggregatePersistence(
      vi.fn().mockResolvedValue(db),
    )
    const id: ScheduleGenerateId = makeUUID()

    const result = await favoritePersistence.create(
      StoresDB.FAVORITES,
      { id },
      'user-1',
    )

    expect(result.id).toBe(id)
    expect(add).toHaveBeenCalledWith(
      StoresDB.FAVORITES,
      expect.objectContaining({ id }),
    )
  })

  it('updates metadata while preserving the original creator', async () => {
    const value: IProfile = {
      id: makeUUID(),
      facultyId: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      createdBy: 'user-1',
      updatedAt: '2026-01-02T00:00:00.000Z',
      updatedBy: 'user-2',
      setupCompleted: true,
      specialityId: 1,
    }

    const result = await persistence.update(StoresDB.PROFILE, value, 'user-2')

    expect(result).toMatchObject({
      ...value,
      createdBy: 'user-1',
      updatedAt: expect.any(String),
      updatedBy: 'user-2',
    })
    expect(put).toHaveBeenCalledWith(StoresDB.PROFILE, result)
  })

  it('removes only the requested user entity', async () => {
    const id: ProfileId = makeUUID()
    await persistence.remove(StoresDB.PROFILE, 'user-1', id)
    expect(remove).toHaveBeenCalledWith(StoresDB.PROFILE, ['user-1', id])
  })
})
