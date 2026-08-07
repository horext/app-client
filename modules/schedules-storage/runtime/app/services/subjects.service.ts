import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  ISubjectSchedulesUpdate,
} from '../../shared/interfaces/subject'
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
  
  async update(
    id: ISubjectSchedules['id'],
    subject: ISubjectSchedulesUpdate,
  ): Promise<ISubjectSchedules> {
    const data = await this.repo.findById(id)
    if (!data) {
      throw new Error(`Subject with id ${id} not found`)
    }
    return await this.repo.update({
      ...data,
      ...subject,
    })
  }
}
