import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { PlannedSubject } from '#shared/domain'
import { SubjectsService } from '#shared/application/services/subjects.service'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type {
  IBasePlannedSubject,
  PlannedSubjectId,
} from '#shared/domain/types/subject'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'
import { makeUUID } from '~~/shared/domain/types/ids'

const subjectInput: IBasePlannedSubject = {
  subject: {
    id: 100,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: { id: 0, name: '', code: '' },
    studyPlan: { id: 0, fromDate: '', code: '', organizationUnit: { id: 0 } },
    cycle: null,
  },
  color: '#3F51B5',
  schedules: [],
}
const createSubject = () =>
  PlannedSubject.restore(
    persistedSnapshot(PlannedSubject.create(subjectInput).toSnapshot()),
  )
describe('SubjectsService', () => {
  const makeRepo = (): Mocked<ISubjectsRepository> => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })
  let repo: Mocked<ISubjectsRepository>
  let service: SubjectsService
  beforeEach(() => {
    repo = makeRepo()
    service = new SubjectsService(repo)
  })
  describe('getAll', () => {
    it('returns all subjects', async () => {
      repo.findAll.mockResolvedValue([createSubject()])
      expect(await service.getAll('user-1')).toHaveLength(1)
    })
  })
  describe('create', () => {
    it('creates a subject', async () => {
      const subject = createSubject()
      repo.create.mockResolvedValue(subject)
      const result = await service.create('user-1', subjectInput)
      expect(result).toMatchObject({ id: subject.id })
    })
  })
  describe('delete', () => {
    it('deletes a subject by id', async () => {
      const id: PlannedSubjectId = makeUUID()
      await service.delete('user-1', id)
      expect(repo.delete).toHaveBeenCalledWith('user-1', id, undefined)
    })
  })
  describe('patch', () => {
    it('updates a subject', async () => {
      const subject = createSubject()
      repo.findById.mockResolvedValue(subject)
      repo.update.mockResolvedValue(subject)
      const result = await service.patch('user-1', subject.id, {
        schedules: [],
      })
      expect(repo.update).toHaveBeenCalledWith(
        'user-1',
        expect.any(PlannedSubject),
      )
      expect(result).toMatchObject({ id: subject.id })
    })

    it('updates subject fields without changing the catalog subject id', async () => {
      const subject = createSubject()
      repo.findById.mockResolvedValue(subject)
      repo.update.mockImplementation(async (_userId, updated) => updated)

      const result = await service.patch('user-1', subject.id, {
        subject: {
          course: { id: 'CS101', name: 'Updated Intro to CS' },
          credits: 5,
          type: subject.toSnapshot().subject.type,
          studyPlan: subject.toSnapshot().subject.studyPlan,
          cycle: 2,
        },
      })

      expect(result.toSnapshot().subject).toMatchObject({
        id: subject.toSnapshot().subject.id,
        course: { name: 'Updated Intro to CS' },
        credits: 5,
        cycle: 2,
      })
    })
  })
})
