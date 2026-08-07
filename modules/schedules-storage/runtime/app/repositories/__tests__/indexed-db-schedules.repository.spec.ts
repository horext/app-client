import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UUID } from 'crypto'
import {
  IndexedDBSchedulesRepository,
  IndexedDBScheduleFavoritesRepository,
} from '../indexed-db-schedules.repository'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../../../shared/interfaces/schedule'

const baseSchedule: IBaseScheduleGenerate = {
  scheduleSubjectKey: 'key-1',
  schedulesSubject: [],
  crossings: 0,
  events: [],
}

const schedule: IScheduleGenerate = {
  ...baseSchedule,
  id: 'sch-0-0-0-1' as UUID,
}

const makeTx = (store: object) => ({
  store,
  done: Promise.resolve(),
})

const makeDb = () => {
  const store = {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    index: vi.fn(),
  }
  return {
    getAll: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(() => makeTx(store)),
    _store: store,
  }
}

describe('IndexedDBSchedulesRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBSchedulesRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBSchedulesRepository(() => Promise.resolve(db as never))
  })

  describe('getEntries', () => {
    it('returns empty array for empty ids', async () => {
      expect(await repo.getEntries([])).toEqual([])
    })

    it('returns schedules by ids, filtering undefined results', async () => {
      db._store.get
        .mockResolvedValueOnce(schedule)
        .mockResolvedValueOnce(undefined)
      expect(
        await repo.getEntries([schedule.id, 'sch-0-0-0-9' as UUID]),
      ).toEqual([schedule])
    })
  })

  describe('getByKey', () => {
    it('returns schedule matching the key', async () => {
      const idx = { get: vi.fn().mockResolvedValue(schedule) }
      db._store.index.mockReturnValue(idx)
      expect(await repo.getByKey('key-1')).toEqual(schedule)
    })

    it('returns undefined when key not found', async () => {
      const idx = { get: vi.fn().mockResolvedValue(undefined) }
      db._store.index.mockReturnValue(idx)
      expect(await repo.getByKey('missing')).toBeUndefined()
    })
  })

  describe('create', () => {
    it('returns a new schedule with generated id and input data', async () => {
      db.put.mockResolvedValue(undefined)
      const result = await repo.create(baseSchedule)
      expect(result.scheduleSubjectKey).toBe(baseSchedule.scheduleSubjectKey)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
    })
  })

  describe('update', () => {
    it('returns the updated schedule', async () => {
      db.put.mockResolvedValue(undefined)
      expect(await repo.update(schedule)).toEqual(schedule)
    })
  })

  describe('saveAll', () => {
    it('returns empty array for empty input', async () => {
      expect(await repo.saveAll([])).toEqual([])
    })

    it('returns all schedules with generated ids', async () => {
      db._store.put.mockResolvedValue(undefined)
      const result = await repo.saveAll([baseSchedule, baseSchedule])
      expect(result).toHaveLength(2)
      expect(result[0]!.id).toMatch(/^[0-9a-f-]+$/)
      expect(result[1]!.id).toMatch(/^[0-9a-f-]+$/)
    })
  })

  describe('deleteEntry', () => {
    it('resolves without error', async () => {
      db.delete.mockResolvedValue(undefined)
      await expect(repo.deleteEntry(schedule.id)).resolves.toBeUndefined()
    })
  })

  describe('deleteEntries', () => {
    it('resolves without error for empty ids', async () => {
      await expect(repo.deleteEntries([])).resolves.toBeUndefined()
    })

    it('resolves without error for multiple ids', async () => {
      db._store.delete.mockResolvedValue(undefined)
      await expect(
        repo.deleteEntries([schedule.id, 'sch-0-0-0-2' as UUID]),
      ).resolves.toBeUndefined()
    })
  })
})

describe('IndexedDBScheduleFavoritesRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBScheduleFavoritesRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBScheduleFavoritesRepository(() =>
      Promise.resolve(db as never),
    )
  })

  describe('getIds', () => {
    it('returns ids from stored favorites', async () => {
      db.getAll.mockResolvedValue([{ id: schedule.id }])
      expect(await repo.getIds()).toEqual([schedule.id])
    })
  })

  describe('isInList', () => {
    it('returns true when id is in favorites', async () => {
      db.get.mockResolvedValue({ id: schedule.id })
      expect(await repo.findById(schedule.id)).toEqual({ id: schedule.id })
    })

    it('returns false when id is not in favorites', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.findById(schedule.id)).toBeUndefined()
    })
  })

  describe('addToList', () => {
    it('resolves without error', async () => {
      db.put.mockResolvedValue(undefined)
      await expect(repo.create(schedule.id)).resolves.toEqual({ id: schedule.id })
    })
  })

  describe('removeFromList', () => {
    it('resolves without error', async () => {
      db.delete.mockResolvedValue(undefined)
      await expect(repo.deleteById(schedule.id)).resolves.toBeUndefined()
    })
  })
})
