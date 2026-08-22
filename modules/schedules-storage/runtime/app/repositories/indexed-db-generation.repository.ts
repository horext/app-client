import { ScheduleGeneration } from '#shared/domain'
import type {
  ScheduleGenerationId,
  IBaseScheduleGeneration,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBGenerationsRepository implements IGenerationRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<ScheduleGeneration[]> {
    return (await this.persistence.findAll(StoresDB.GENERATIONS, userId)).map(
      ScheduleGeneration.restore,
    )
  }

  async findById(
    userId: string,
    id: ScheduleGenerationId,
  ): Promise<ScheduleGeneration | undefined> {
    const record = await this.persistence.find(StoresDB.GENERATIONS, userId, id)
    return record ? ScheduleGeneration.restore(record) : undefined
  }

  async create(
    userId: string,
    record: ScheduleGeneration<IBaseScheduleGeneration>,
  ): Promise<ScheduleGeneration<IScheduleGeneration>> {
    const stored = await this.persistence.create(
      StoresDB.GENERATIONS,
      record.toSnapshot(),
      userId,
    )
    return ScheduleGeneration.restore(stored)
  }

  async update(
    userId: string,
    record: ScheduleGeneration<IScheduleGeneration>,
  ): Promise<ScheduleGeneration<IScheduleGeneration>> {
    return ScheduleGeneration.restore(
      await this.persistence.update(
        StoresDB.GENERATIONS,
        record.toSnapshot(),
        userId,
      ),
    )
  }

  async delete(userId: string, id: ScheduleGenerationId): Promise<void> {
    await this.persistence.remove(StoresDB.GENERATIONS, userId, id)
  }
}
