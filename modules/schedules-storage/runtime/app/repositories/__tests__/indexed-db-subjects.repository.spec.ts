import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UUID } from 'crypto'
import { IndexedDBSubjectsRepository } from '../indexed-db-subjects.repository'
import type { ISubjectSchedules } from '../../../shared/interfaces/subject'

const makeSubject = (id = 'sub-0-0-0-1' as UUID): ISubjectSchedules => ({
  id,
  subject: {
    id: 1,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: { id: 0, name: '', code: '' },
    studyPlan: { id: 0, fromDate: '', code: '', organizationUnit: { id: 0 } },
    cycle: null,
  },
  schedules: [],
})

const makeDb = () => ({
  getAll: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
})

describe('IndexedDBSubjectsRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBSubjectsRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBSubjectsRepository(() => Promise.resolve(db as never))
  })

  describe('getAll', () => {
    it('returns all subjects', async () => {
      const subjects = [makeSubject()]
      db.getAll.mockResolvedValue(subjects)
      expect(await repo.getAll()).toEqual(subjects)
    })

    it('returns empty array when store is empty', async () => {
      db.getAll.mockResolvedValue([])
      expect(await repo.getAll()).toEqual([])
    })
  })

  describe('update', () => {
    it('returns the updated subject', async () => {
      const subject = makeSubject()
      db.put.mockResolvedValue(undefined)
      expect(await repo.update(subject)).toEqual(subject)
    })
  })

  describe('create', () => {
    it('returns a new subject with generated id and input data', async () => {
      const { id: _, ...base } = makeSubject()
      db.put.mockResolvedValue(undefined)
      const result = await repo.create(base)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
      expect(result.subject).toEqual(base.subject)
    })
  })

  describe('delete', () => {
    it('resolves without error', async () => {
      db.delete.mockResolvedValue(undefined)
      await expect(repo.delete('sub-0-0-0-1' as UUID)).resolves.toBeUndefined()
    })
  })
})
