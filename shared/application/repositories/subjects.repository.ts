import type { UUID } from 'crypto'
import type { UserSubject } from '#shared/domain'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '#shared/domain/types/subject'

export interface ISubjectsRepository {
  getAll(userId: string): Promise<UserSubject[]>
  findById(userId: string, id: UUID): Promise<UserSubject | undefined>
  create(
    userId: string,
    subject: UserSubject<IBaseSubjectSchedules>,
  ): Promise<UserSubject<ISubjectSchedules>>
  update(
    userId: string,
    subject: UserSubject<ISubjectSchedules>,
  ): Promise<UserSubject<ISubjectSchedules>>
  delete(userId: string, id: UUID): Promise<void>
}
