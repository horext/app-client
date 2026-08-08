import type { ISubjectSchedules } from '../../shared/interfaces/subject'
import {
  UserSubject,
  type IUserSubjectCreate,
  type IUserSubjectUpdate,
} from '../../shared/domain'
import type { ISubjectsRepository } from '../repositories/subjects-repository.interface'
import type { ISubjectsService } from './subjects.service.interface'

export class SubjectsService implements ISubjectsService {
  constructor(private readonly repo: ISubjectsRepository) {}

  getAll(userId: string): Promise<ISubjectSchedules[]> {
    return this.repo
      .getAll(userId)
      .then((items) => items.map((item) => item.toSnapshot()))
  }

  async create(
    userId: string,
    subject: IUserSubjectCreate,
  ): Promise<ISubjectSchedules> {
    const entity = UserSubject.create(subject)
    return (await this.repo.create(userId, entity)).toSnapshot()
  }

  delete(userId: string, id: ISubjectSchedules['id']): Promise<void> {
    return this.repo.delete(userId, id)
  }

  async update(
    userId: string,
    id: ISubjectSchedules['id'],
    subject: IUserSubjectUpdate,
  ): Promise<ISubjectSchedules> {
    const data = await this.repo.findById(userId, id)
    if (!data) {
      throw new Error(`Subject with id ${id} not found`)
    }
    const updated = data.update(subject)
    return (await this.repo.update(userId, updated)).toSnapshot()
  }
}
