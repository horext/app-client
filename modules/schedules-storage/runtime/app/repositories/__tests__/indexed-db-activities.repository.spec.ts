import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UUID } from 'crypto'
import type { Weekdays, IActivity, IBaseActivity  } from '../../../shared/interfaces/event'
import { IndexedDBActivitiesRepository } from '../indexed-db-activities.repository'

const baseActivity: IBaseActivity = {
  title: 'Math',
  day: 1 as Weekdays,
  color: '#fff',
  startTime: '08:00',
  endTime: '10:00',
}

const activity: IActivity = {
  ...baseActivity,
  id: 'act-0-0-0-1' as UUID,
  category: 'MY_EVENT',
  type: 'MY_EVENT',
}

const makeDb = () => ({
  getAll: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
})

describe('IndexedDBActivitiesRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBActivitiesRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBActivitiesRepository(() => Promise.resolve(db as never))
  })

  describe('getAll', () => {
    it('returns all activities', async () => {
      db.getAll.mockResolvedValue([activity])
      expect(await repo.getAll()).toEqual([activity])
    })

    it('returns empty array when store is empty', async () => {
      db.getAll.mockResolvedValue([])
      expect(await repo.getAll()).toEqual([])
    })
  })

  describe('get', () => {
    it('returns activity by id', async () => {
      db.get.mockResolvedValue(activity)
      expect(await repo.get(activity.id)).toEqual(activity)
    })

    it('returns undefined when not found', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.get('act-0-0-0-9' as UUID)).toBeUndefined()
    })
  })

  describe('create', () => {
    it('returns a new activity with generated id, MY_EVENT category and type', async () => {
      db.put.mockResolvedValue(undefined)
      const result = await repo.create(baseActivity)
      expect(result.title).toBe(baseActivity.title)
      expect(result.category).toBe('MY_EVENT')
      expect(result.type).toBe('MY_EVENT')
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
    })
  })

  describe('update', () => {
    it('returns the updated activity', async () => {
      db.put.mockResolvedValue(undefined)
      expect(await repo.update(activity)).toEqual(activity)
    })
  })

  describe('delete', () => {
    it('resolves without error', async () => {
      db.delete.mockResolvedValue(undefined)
      await expect(repo.delete(activity.id)).resolves.toBeUndefined()
    })
  })
})
