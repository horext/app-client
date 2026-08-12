import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Favorite, Schedule } from '#shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import {
  IndexedDBSchedulesRepository,
  IndexedDBScheduleFavoritesRepository,
} from '../indexed-db-schedules.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const baseSchedule = {
  scheduleSubjectKey: 'key-1',
  schedulesSubject: [],
  crossings: 0,
  events: [],
}
const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  findAllByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})

describe('IndexedDBSchedulesRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBSchedulesRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBSchedulesRepository(persistence)
  })
  describe('findByIds', () => {
    it('returns empty array for empty ids', async () => {
      expect(await repo.getEntries('user-1', [])).toEqual([])
    })
    it('returns schedules by ids, filtering undefined results', async () => {
      const schedule = Schedule.create(baseSchedule)
      const missingId = crypto.randomUUID()
      const stored = persistedSnapshot(schedule.toSnapshot())
      persistence.find
        .mockResolvedValueOnce(stored)
        .mockResolvedValueOnce(undefined)
      expect(
        await repo.getEntries('user-1', [stored.id, missingId]),
      ).toHaveLength(1)
    })
  })
  describe('findByKey', () => {
    it('returns schedule matching the key', async () => {
      const schedule = Schedule.create(baseSchedule)
      persistence.findByIndex.mockResolvedValue(
        persistedSnapshot(schedule.toSnapshot()),
      )
      expect(await repo.getByKey('user-1', 'key-1')).toBeDefined()
    })
    it('returns undefined when key not found', async () => {
      persistence.findByIndex.mockResolvedValue(undefined)
      expect(await repo.getByKey('user-1', 'missing')).toBeUndefined()
    })
  })
  describe('create', () => {
    it('returns a saved schedule', async () => {
      const schedule = Schedule.create(baseSchedule)
      persistence.create.mockResolvedValue(
        persistedSnapshot(schedule.toSnapshot()),
      )
      expect(await repo.create('user-1', schedule)).toBeDefined()
    })
  })
  describe('createAll', () => {
    it('returns empty array for empty input', async () => {
      expect(await repo.createAll('user-1', [])).toEqual([])
    })
    it('returns all schedules', async () => {
      const a = Schedule.create(baseSchedule)
      const b = Schedule.create(baseSchedule)
      persistence.create
        .mockResolvedValueOnce(persistedSnapshot(a.toSnapshot()))
        .mockResolvedValueOnce(persistedSnapshot(b.toSnapshot()))
      expect(await repo.createAll('user-1', [a, b])).toHaveLength(2)
    })
  })
  describe('delete', () => {
    it('resolves without error', async () => {
      await expect(
        repo.deleteEntry('user-1', crypto.randomUUID()),
      ).resolves.toBeUndefined()
    })
  })
  describe('deleteAll', () => {
    it('resolves without error for empty ids', async () => {
      await expect(repo.deleteEntries('user-1', [])).resolves.toBeUndefined()
    })
    it('resolves without error for multiple ids', async () => {
      await expect(
        repo.deleteEntries('user-1', [
          crypto.randomUUID(),
          crypto.randomUUID(),
        ]),
      ).resolves.toBeUndefined()
    })
  })
})

describe('IndexedDBScheduleFavoritesRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBScheduleFavoritesRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBScheduleFavoritesRepository(persistence)
  })
  describe('findAll', () => {
    it('returns stored favorites', async () => {
      const favorite = Favorite.create({ scheduleId: crypto.randomUUID() })
      persistence.findAll.mockResolvedValue([
        persistedSnapshot(favorite.toSnapshot()),
      ])
      expect(await repo.findAll('user-1')).toHaveLength(1)
    })
  })
  describe('findById', () => {
    it('returns favorite when present', async () => {
      const favorite = Favorite.create({ scheduleId: crypto.randomUUID() })
      const stored = persistedSnapshot(favorite.toSnapshot())
      persistence.find.mockResolvedValue(stored)
      expect(await repo.findById('user-1', stored.id)).toBeDefined()
    })
    it('returns undefined when absent', async () => {
      persistence.find.mockResolvedValue(undefined)
      expect(await repo.findById('user-1', crypto.randomUUID())).toBeUndefined()
    })
  })
  describe('create', () => {
    it('persists the schedule id as the favorite id', async () => {
      const favorite = Favorite.create({ scheduleId: crypto.randomUUID() })
      persistence.create.mockResolvedValue(
        persistedSnapshot(favorite.toSnapshot()),
      )
      await expect(repo.create('user-1', favorite)).resolves.toBeDefined()
    })
  })
  describe('delete', () => {
    it('resolves without error', async () => {
      await expect(
        repo.delete('user-1', crypto.randomUUID()),
      ).resolves.toBeUndefined()
    })
  })
})
