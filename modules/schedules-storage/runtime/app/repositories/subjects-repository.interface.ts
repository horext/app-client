import type { ISelectedSubject } from '../../shared/interfaces/subject'

export interface ISubjectsRepository {
  getAll(): Promise<ISelectedSubject[]>
  save(subject: ISelectedSubject): Promise<void>
  delete(id: ISelectedSubject['id']): Promise<void>
}
