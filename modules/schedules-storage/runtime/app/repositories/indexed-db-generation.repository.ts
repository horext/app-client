import type { BaseScheduleGeneration, ScheduleGeneration } from '#shared/domain'
import type { ScheduleGenerationId } from '#shared/domain/types/schedule-generation'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { ScheduleGenerationPersistenceMapper } from '../mappers/persistence'

export class IndexedDBGenerationsRepository implements IGenerationRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<ScheduleGeneration[]> {
    return (await this.persistence.findAll(StoresDB.GENERATIONS, userId)).map(
      ScheduleGenerationPersistenceMapper.fromRecord,
    )
  }

  async findById(
    userId: string,
    id: ScheduleGenerationId,
  ): Promise<ScheduleGeneration | undefined> {
    const record = await this.persistence.find(StoresDB.GENERATIONS, userId, id)
    return record
      ? ScheduleGenerationPersistenceMapper.fromRecord(record)
      : undefined
  }

  async create(
    userId: string,
    record: BaseScheduleGeneration,
  ): Promise<ScheduleGeneration> {
    const stored = await this.persistence.create(
      StoresDB.GENERATIONS,
      ScheduleGenerationPersistenceMapper.toCreateRecord(record),
      userId,
    )
    return ScheduleGenerationPersistenceMapper.fromRecord(stored)
  }

  async update(
    userId: string,
    record: ScheduleGeneration,
  ): Promise<ScheduleGeneration> {
    return ScheduleGenerationPersistenceMapper.fromRecord(
      await this.persistence.update(
        StoresDB.GENERATIONS,
        ScheduleGenerationPersistenceMapper.toRecord(record),
        userId,
      ),
    )
  }

  async delete(userId: string, id: ScheduleGenerationId): Promise<void> {
    await this.persistence.remove(StoresDB.GENERATIONS, userId, id)
  }
}
