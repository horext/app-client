import type { ISubjectSchedules } from '#shared/domain/types/subject'
import {
  UserSubject,
  type IUserSubjectCreate,
  type IUserSubjectUpdate,
} from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { ISubjectsService } from '../interfaces/subjects.service'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class SubjectsService implements ISubjectsService {
  constructor(private readonly repo: ISubjectsRepository) {}

  getAll(userId: string): Promise<UserSubject<ISubjectSchedules>[]> {
    return this.repo.getAll(userId)
  }

  async get(
    userId: string,
    id: ISubjectSchedules['id'],
  ): Promise<UserSubject<ISubjectSchedules> | undefined> {
    return this.repo.findById(userId, id)
  }

  async create(userId: string, subject: IUserSubjectCreate) {
    return this.repo.create(userId, UserSubject.create(subject))
  }

  delete(
    userId: string,
    id: ISubjectSchedules['id'],
    expectedRevision?: number,
  ): Promise<void> {
    return this.repo.delete(userId, id, expectedRevision)
  }

  async patch(
    userId: string,
    id: ISubjectSchedules['id'],
    subject: IUserSubjectUpdate,
  ): Promise<UserSubject<ISubjectSchedules>> {
    const data = await this.repo.findById(userId, id)
    if (!data) {
      throw new ResourceNotFoundError('subject')
    }
    const updated = data.update(subject)
    return this.repo.update(userId, updated)
  }
}
