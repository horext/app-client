import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '../../shared/interfaces/subject'

export interface ISubjectsRepository {
  getAll(): Promise<ISubjectSchedules[]>
  findById(id: ISubjectSchedules['id']): Promise<ISubjectSchedules | undefined>
  create(subject: IBaseSubjectSchedules): Promise<ISubjectSchedules>
  update(subject: ISubjectSchedules): Promise<ISubjectSchedules>
  delete(id: ISubjectSchedules['id']): Promise<void>
}
