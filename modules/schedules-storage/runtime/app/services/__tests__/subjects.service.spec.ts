import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { UserSubject } from '../../../shared/domain'
import { SubjectsService } from '../subjects.service'
import type { ISubjectsRepository } from '../../repositories/subjects-repository.interface'
import type { IBaseSubjectSchedules } from '../../../shared/interfaces/subject'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const subjectInput: IBaseSubjectSchedules = {
  subject: {
    id: 100,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: { id: 0, name: '', code: '' },
    studyPlan: { id: 0, fromDate: '', code: '', organizationUnit: { id: 0 } },
    cycle: null,
  },
  schedules: [],
}
const createSubject = () =>
  UserSubject.restore(
    persistedSnapshot(UserSubject.create(subjectInput).toSnapshot()),
  )
describe('SubjectsService', () => {
  const makeRepo = (): Mocked<ISubjectsRepository> => ({
    getAll: vi.fn(),
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
      repo.getAll.mockResolvedValue([createSubject()])
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
      const id = crypto.randomUUID()
      await service.delete('user-1', id)
      expect(repo.delete).toHaveBeenCalledWith('user-1', id)
    })
  })
  describe('update', () => {
    it('updates a subject', async () => {
      const subject = createSubject()
      repo.findById.mockResolvedValue(subject)
      repo.update.mockResolvedValue(subject)
      const result = await service.update('user-1', subject.id, {
        schedules: [],
      })
      expect(repo.update).toHaveBeenCalledWith(
        'user-1',
        expect.any(UserSubject),
      )
      expect(result).toMatchObject({ id: subject.id })
    })
  })
})
