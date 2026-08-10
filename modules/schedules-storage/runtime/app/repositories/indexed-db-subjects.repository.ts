import type { UUID } from 'crypto'
import { UserSubject } from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBSubjectsRepository implements ISubjectsRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async getAll(userId: string): Promise<UserSubject[]> {
    return (await this.persistence.findAll(StoresDB.SUBJECTS, userId)).map(
      UserSubject.restore,
    )
  }

  async findById(userId: string, id: UUID): Promise<UserSubject | undefined> {
    const record = await this.persistence.find(StoresDB.SUBJECTS, userId, id)
    return record ? UserSubject.restore(record) : undefined
  }

  async delete(userId: string, id: UUID): Promise<void> {
    await this.persistence.remove(StoresDB.SUBJECTS, userId, id)
  }

  async create(userId: string, subject: UserSubject): Promise<UserSubject> {
    const stored = await this.persistence.create(
      StoresDB.SUBJECTS,
      subject.toSnapshot(),
      userId,
    )
    return UserSubject.restore(stored)
  }

  async update(userId: string, subject: UserSubject): Promise<UserSubject> {
    const stored = await this.persistence.update(
      StoresDB.SUBJECTS,
      subject.toSnapshot(),
      userId,
    )
    return UserSubject.restore(stored)
  }
}
