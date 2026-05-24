import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { SubjectsService } from '../subjects.service'
import type { ISubjectsRepository } from '../../repositories/subjects-repository.interface'
import type { ISubjectSchedules } from '~/interfaces/subject'

const makeRepo = (): Mocked<ISubjectsRepository> => ({
  getAll: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
})

const makeSubject = (id = crypto.randomUUID()): ISubjectSchedules => ({
  id,
  schedules: [],
  subject: {
    id: 100,
    course: { id: 'CS101', name: 'Intro to CS' },
    credits: 3,
    type: {
      id: 0,
      name: '',
      code: '',
    },
    studyPlan: {
      id: 0,
      fromDate: '',
      code: '',
      organizationUnit: {
        id: 0,
      },
    },
    cycle: null,
  },
})

describe('SubjectsService', () => {
  let repo: Mocked<ISubjectsRepository>
  let service: SubjectsService

  beforeEach(() => {
    repo = makeRepo()
    service = new SubjectsService(repo)
  })

  describe('getAll', () => {
    it('returns all subjects', async () => {
      repo.getAll.mockResolvedValue([makeSubject()])
      const result = await service.getAll()
      expect(result).toHaveLength(1)
    })
  })

  describe('create', () => {
    it('creates a subject', async () => {
      const subject = makeSubject()
      repo.create.mockResolvedValue(subject)
      const { id: _, ...base } = subject
      const result = await service.create(base)
      expect(result).toEqual(subject)
    })
  })

  describe('delete', () => {
    it('deletes a subject by id', async () => {
      repo.delete.mockResolvedValue(undefined)
      const id = crypto.randomUUID()
      await service.delete(id)
      expect(repo.delete).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('updates a subject', async () => {
      const subject = makeSubject()
      repo.update.mockResolvedValue(subject)
      const { id: id, ...base } = subject
      const result = await service.update(id, base)
      expect(repo.update).toHaveBeenCalledWith({ id, ...base })
      expect(result).toEqual(subject)
    })
  })
})
