import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  IUserSubjectUpdate,
  SubjectScheduleId,
} from '#shared/domain/types/subject'
import type { UserSubject } from '#shared/domain'

export interface ISubjectsService {
  getAll(userId: string): Promise<UserSubject<ISubjectSchedules>[]>
  get(
    userId: string,
    id: SubjectScheduleId,
  ): Promise<UserSubject<ISubjectSchedules> | undefined>
  create(
    userId: string,
    subject: IBaseSubjectSchedules,
  ): Promise<UserSubject<ISubjectSchedules>>
  delete(
    userId: string,
    id: SubjectScheduleId,
    expectedRevision?: number,
  ): Promise<void>
  patch(
    userId: string,
    id: SubjectScheduleId,
    subject: IUserSubjectUpdate,
  ): Promise<UserSubject<ISubjectSchedules>>
}
