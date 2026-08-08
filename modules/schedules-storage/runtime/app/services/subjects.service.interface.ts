import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  ISubjectSchedulesUpdate,
} from '../../shared/interfaces/subject'

export interface ISubjectsService {
  getAll(userId: string): Promise<ISubjectSchedules[]>
  create(
    userId: string,
    subject: IBaseSubjectSchedules,
  ): Promise<ISubjectSchedules>
  delete(userId: string, id: ISubjectSchedules['id']): Promise<void>
  update(
    userId: string,
    id: ISubjectSchedules['id'],
    subject: ISubjectSchedulesUpdate,
  ): Promise<ISubjectSchedules>
}
