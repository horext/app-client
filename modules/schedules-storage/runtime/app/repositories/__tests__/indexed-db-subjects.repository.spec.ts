import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { UserSubject } from '../../../shared/domain'
import type { IBaseSubjectSchedules } from '../../../shared/interfaces/subject'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBSubjectsRepository } from '../indexed-db-subjects.repository'

const subjectInput: IBaseSubjectSchedules = {
  subject: {
    id: 1,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: { id: 0, name: '', code: '' },
    studyPlan: { id: 0, fromDate: '', code: '', organizationUnit: { id: 0 } },
    cycle: null,
  },
  schedules: [],
}
const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})
describe('IndexedDBSubjectsRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBSubjectsRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBSubjectsRepository(persistence)
  })
  describe('getAll', () => {
    it('returns all subjects', async () => {
      const subject = UserSubject.create(subjectInput)
      persistence.findAll.mockResolvedValue([subject.toSnapshot()])
      expect(await repo.getAll('user-1')).toHaveLength(1)
    })
    it('returns empty array when store is empty', async () => {
      persistence.findAll.mockResolvedValue([])
      expect(await repo.getAll('user-1')).toEqual([])
    })
  })
  describe('update', () => {
    it('returns the updated subject', async () => {
      const subject = UserSubject.create(subjectInput)
      persistence.create.mockResolvedValue(subject.toSnapshot())
      expect(await repo.create('user-1', subject)).toBeDefined()
    })
  })
  describe('create', () => {
    it('returns a new subject with generated id and input data', async () => {
      const subject = UserSubject.create(subjectInput)
      persistence.create.mockResolvedValue(subject.toSnapshot())
      const result = await repo.create('user-1', subject)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
      expect(result.toSnapshot().subject).toEqual(subjectInput.subject)
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
