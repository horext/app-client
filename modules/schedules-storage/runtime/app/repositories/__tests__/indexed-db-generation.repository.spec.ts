import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UUID } from 'crypto'
import type { Weekdays } from '../../../shared/interfaces/event'
import { IndexedDBGenerationRepository } from '../indexed-db-generation.repository'
import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../../../shared/interfaces/generation-record'

const baseRecord: IBaseGenerationRecord = {
  generatedAt: '2024-01-01T00:00:00Z',
  scheduleIds: [],
  crossingsSetting: 0,
  weekDays: [1, 2, 3] as Weekdays[],
  hourlyLoadId: 1,
  resultCount: 0,
  occurrences: [],
}

const record: IGenerationRecord = {
  ...baseRecord,
  id: 'rec-0-0-0-1' as UUID,
}

const makeDb = () => ({
  getAll: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
})

describe('IndexedDBGenerationRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBGenerationRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBGenerationRepository(() => Promise.resolve(db as never))
  })

  describe('getAll', () => {
    it('returns all records', async () => {
      db.getAll.mockResolvedValue([record])
      expect(await repo.getAll()).toEqual([record])
    })

    it('returns empty array when store is empty', async () => {
      db.getAll.mockResolvedValue([])
      expect(await repo.getAll()).toEqual([])
    })
  })

  describe('get', () => {
    it('returns record by id', async () => {
      db.get.mockResolvedValue(record)
      expect(await repo.get(record.id)).toEqual(record)
    })

    it('returns undefined when not found', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.get('rec-0-0-0-9' as UUID)).toBeUndefined()
    })
  })

  describe('create', () => {
    it('returns a new record with generated id and input data', async () => {
      db.put.mockResolvedValue(undefined)
      const result = await repo.create(baseRecord)
      expect(result.generatedAt).toBe(baseRecord.generatedAt)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
    })
  })

  describe('delete', () => {
    it('resolves without error', async () => {
      db.delete.mockResolvedValue(undefined)
      await expect(repo.delete(record.id)).resolves.toBeUndefined()
    })
  })
})
