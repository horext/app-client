import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { PlannedSubject } from '#shared/domain'
import type {
  IBasePlannedSubject,
  PlannedSubjectId,
} from '#shared/domain/types/subject'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBSubjectsRepository } from '../indexed-db-subjects.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'
import { makeUUID } from '~~/shared/domain/types/ids'

const subjectInput: IBasePlannedSubject = {
  subject: {
    id: 1,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: { id: 0, name: '', code: '' },
    studyPlan: { id: 0, fromDate: '', code: '', organizationUnit: { id: 0 } },
    cycle: null,
  },
  color: '#3F51B5',
  schedules: [],
}
const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  findAllByIndex: vi.fn(),
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
      const stored = persistedSnapshot<IBasePlannedSubject, PlannedSubjectId>(
        subjectInput,
      )
      persistence.findAll.mockResolvedValue([stored])
      expect(await repo.findAll('user-1')).toHaveLength(1)
    })
    it('returns empty array when store is empty', async () => {
      persistence.findAll.mockResolvedValue([])
      expect(await repo.findAll('user-1')).toEqual([])
    })
  })
  describe('update', () => {
    it('returns the updated subject', async () => {
      const subject = PlannedSubject.reconstitute(
        persistedSnapshot(subjectInput),
      )
      persistence.create.mockResolvedValue(persistedSnapshot(subjectInput))
      expect(await repo.create('user-1', subject)).toBeDefined()
    })
  })
  describe('create', () => {
    it('returns a new subject with generated id and input data', async () => {
      const subject = PlannedSubject.reconstitute(
        persistedSnapshot(subjectInput),
      )
      persistence.create.mockResolvedValue(persistedSnapshot(subjectInput))
      const result = await repo.create('user-1', subject)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
      expect(result.subject).toEqual(subjectInput.subject)
    })
  })
  describe('delete', () => {
    it('resolves without error', async () => {
      await expect(repo.delete('user-1', makeUUID())).resolves.toBeUndefined()
    })
  })
})
