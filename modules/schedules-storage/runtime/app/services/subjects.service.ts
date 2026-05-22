import type { IBaseSubjectSchedules, ISubjectSchedules } from '../../shared/interfaces/subject'
import type { ISubjectsRepository } from '../repositories/subjects-repository.interface'
import type { ISubjectsService } from './subjects.service.interface'

export class SubjectsService implements ISubjectsService {
  constructor(private readonly repo: ISubjectsRepository) {}

  getAll(): Promise<ISubjectSchedules[]> {
    return this.repo.getAll()
  }

  create(subject: IBaseSubjectSchedules): Promise<ISubjectSchedules> {
    return this.repo.create(subject)
  }

  delete(id: ISubjectSchedules['id']): Promise<void> {
    return this.repo.delete(id)
  }

  update(id: ISubjectSchedules['id'], subject: IBaseSubjectSchedules): Promise<ISubjectSchedules> {
    return this.repo.update({
      id,
      ...subject,
    })
  }
}
