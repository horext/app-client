import type { ISelectedSubject } from '../../shared/interfaces/subject'
import type { ISubjectsRepository } from '../repositories/subjects-repository.interface'
import type { ISubjectsService } from './subjects.service.interface'

export class SubjectsService implements ISubjectsService {
  constructor(private readonly repo: ISubjectsRepository) {}

  getAll(): Promise<ISelectedSubject[]> {
    return this.repo.getAll()
  }

  save(subject: ISelectedSubject): Promise<void> {
    return this.repo.save(subject)
  }

  delete(id: ISelectedSubject['id']): Promise<void> {
    return this.repo.delete(id)
  }

  update(subject: ISelectedSubject): Promise<void> {
    return this.repo.save(subject)
  }
}
