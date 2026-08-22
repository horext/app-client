import type {
  IPlannedSubject,
  PlannedSubjectId,
} from '#shared/domain/types/subject'
import {
  PlannedSubject,
  type IPlannedSubjectCreate,
  type IPlannedSubjectUpdate,
} from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { ISubjectsService } from '../interfaces/subjects.service'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class SubjectsService implements ISubjectsService {
  constructor(private readonly repo: ISubjectsRepository) {}

  getAll(userId: string): Promise<PlannedSubject<IPlannedSubject>[]> {
    return this.repo.findAll(userId)
  }

  async get(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject<IPlannedSubject> | undefined> {
    return this.repo.findById(userId, id)
  }

  async create(userId: string, subject: IPlannedSubjectCreate) {
    return this.repo.create(userId, PlannedSubject.create(subject))
  }

  delete(
    userId: string,
    id: PlannedSubjectId,
    expectedRevision?: number,
  ): Promise<void> {
    return this.repo.delete(userId, id, expectedRevision)
  }

  async patch(
    userId: string,
    id: PlannedSubjectId,
    subject: IPlannedSubjectUpdate,
  ): Promise<PlannedSubject<IPlannedSubject>> {
    const data = await this.repo.findById(userId, id)
    if (!data) {
      throw new ResourceNotFoundError('subject')
    }
    const updated = data.update(subject)
    return this.repo.update(userId, updated)
  }
}
