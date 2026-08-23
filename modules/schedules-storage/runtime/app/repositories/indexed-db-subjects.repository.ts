import type {
  BasePlannedSubject,
  PlannedSubject,
  PlannedSubjectId,
} from '#shared/domain'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { PlannedSubjectPersistenceMapper } from '../mappers/persistence'

export class IndexedDBSubjectsRepository implements ISubjectsRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<PlannedSubject[]> {
    return (await this.persistence.findAll(StoresDB.SUBJECTS, userId)).map(
      PlannedSubjectPersistenceMapper.fromRecord,
    )
  }

  async findById(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject | undefined> {
    const record = await this.persistence.find(StoresDB.SUBJECTS, userId, id)
    return record
      ? PlannedSubjectPersistenceMapper.fromRecord(record)
      : undefined
  }

  async delete(userId: string, id: PlannedSubjectId): Promise<void> {
    await this.persistence.remove(StoresDB.SUBJECTS, userId, id)
  }

  async create(
    userId: string,
    subject: BasePlannedSubject,
  ): Promise<PlannedSubject> {
    const stored = await this.persistence.create(
      StoresDB.SUBJECTS,
      PlannedSubjectPersistenceMapper.toCreateRecord(subject),
      userId,
    )
    return PlannedSubjectPersistenceMapper.fromRecord(stored)
  }

  async update(
    userId: string,
    subject: PlannedSubject,
  ): Promise<PlannedSubject> {
    const stored = await this.persistence.update(
      StoresDB.SUBJECTS,
      PlannedSubjectPersistenceMapper.toRecord(subject),
      userId,
    )
    return PlannedSubjectPersistenceMapper.fromRecord(stored)
  }
}
