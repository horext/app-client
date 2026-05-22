import type { IBaseSubjectSchedules, ISubjectSchedules } from '../../shared/interfaces/subject'

export interface ISubjectsService {
  getAll(): Promise<ISubjectSchedules[]>
  create(subject: IBaseSubjectSchedules): Promise<ISubjectSchedules>
  delete(id: ISubjectSchedules['id']): Promise<void>
  update(id: ISubjectSchedules['id'], subject: IBaseSubjectSchedules): Promise<ISubjectSchedules>
}
