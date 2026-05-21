import type { ISelectedSubject } from '../../shared/interfaces/subject'

export interface ISubjectsService {
  getAll(): Promise<ISelectedSubject[]>
  save(subject: ISelectedSubject): Promise<void>
  delete(id: ISelectedSubject['id']): Promise<void>
  update(subject: ISelectedSubject): Promise<void>
}
