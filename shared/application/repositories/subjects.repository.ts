import type { UserSubject } from '#shared/domain'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  SubjectScheduleId,
} from '#shared/domain/types/subject'

export interface ISubjectsRepository {
  findAll(userId: string): Promise<UserSubject[]>
  findById(
    userId: string,
    id: SubjectScheduleId,
  ): Promise<UserSubject | undefined>
  create(
    userId: string,
    subject: UserSubject<IBaseSubjectSchedules>,
  ): Promise<UserSubject<ISubjectSchedules>>
  update(
    userId: string,
    subject: UserSubject<ISubjectSchedules>,
  ): Promise<UserSubject<ISubjectSchedules>>
  delete(
    userId: string,
    id: SubjectScheduleId,
    expectedRevision?: number,
  ): Promise<void>
}
