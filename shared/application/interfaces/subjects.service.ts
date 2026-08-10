import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  ISubjectSchedulesUpdate,
} from '#shared/domain/types/subject'

export interface ISubjectsService {
  getAll(userId: string): Promise<ISubjectSchedules[]>
  get(
    userId: string,
    id: ISubjectSchedules['id'],
  ): Promise<ISubjectSchedules | undefined>
  create(
    userId: string,
    subject: IBaseSubjectSchedules,
  ): Promise<ISubjectSchedules>
  delete(
    userId: string,
    id: ISubjectSchedules['id'],
    expectedRevision?: number,
  ): Promise<void>
  update(
    userId: string,
    id: ISubjectSchedules['id'],
    subject: ISubjectSchedulesUpdate,
  ): Promise<ISubjectSchedules>
}
