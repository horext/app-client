import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  ISubjectSchedulesUpdate,
} from '#shared/domain/types/subject'
import type { UserSubject } from '#shared/domain'

export interface ISubjectsService {
  getAll(userId: string): Promise<UserSubject<ISubjectSchedules>[]>
  get(
    userId: string,
    id: ISubjectSchedules['id'],
  ): Promise<UserSubject<ISubjectSchedules> | undefined>
  create(
    userId: string,
    subject: IBaseSubjectSchedules,
  ): Promise<UserSubject<ISubjectSchedules>>
  delete(
    userId: string,
    id: ISubjectSchedules['id'],
    expectedRevision?: number,
  ): Promise<void>
  patch(
    userId: string,
    id: ISubjectSchedules['id'],
    subject: ISubjectSchedulesUpdate,
  ): Promise<UserSubject<ISubjectSchedules>>
}
