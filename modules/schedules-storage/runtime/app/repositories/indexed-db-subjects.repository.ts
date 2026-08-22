import { PlannedSubject, type PlannedSubjectId } from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBSubjectsRepository implements ISubjectsRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<PlannedSubject[]> {
    return (await this.persistence.findAll(StoresDB.SUBJECTS, userId)).map(
      PlannedSubject.restore,
    )
  }

  async findById(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject | undefined> {
    const record = await this.persistence.find(StoresDB.SUBJECTS, userId, id)
    return record ? PlannedSubject.restore(record) : undefined
  }

  async delete(userId: string, id: PlannedSubjectId): Promise<void> {
    await this.persistence.remove(StoresDB.SUBJECTS, userId, id)
  }

  async create(
    userId: string,
    subject: PlannedSubject,
  ): Promise<PlannedSubject> {
    const stored = await this.persistence.create(
      StoresDB.SUBJECTS,
      subject.toSnapshot(),
      userId,
    )
    return PlannedSubject.restore(stored)
  }

  async update(
    userId: string,
    subject: PlannedSubject,
  ): Promise<PlannedSubject> {
    const stored = await this.persistence.update(
      StoresDB.SUBJECTS,
      subject.toSnapshot(),
      userId,
    )
    return PlannedSubject.restore(stored)
  }
}
