import type { UUID } from 'crypto'
import type { UserSubject } from '../../shared/domain'

export interface ISubjectsRepository {
  getAll(userId: string): Promise<UserSubject[]>
  findById(userId: string, id: UUID): Promise<UserSubject | undefined>
  create(userId: string, subject: UserSubject): Promise<UserSubject>
  update(userId: string, subject: UserSubject): Promise<UserSubject>
  delete(userId: string, id: UUID): Promise<void>
}
