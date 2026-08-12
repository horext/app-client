import { Generation } from '#shared/domain'
import type {
  GenerationId,
  IBaseGenerationRecord,
  IGenerationRecord,
} from '#shared/domain/types/generation-record'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBGenerationsRepository implements IGenerationRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<Generation[]> {
    return (await this.persistence.findAll(StoresDB.GENERATIONS, userId)).map(
      Generation.restore,
    )
  }

  async findById(
    userId: string,
    id: GenerationId,
  ): Promise<Generation | undefined> {
    const record = await this.persistence.find(StoresDB.GENERATIONS, userId, id)
    return record ? Generation.restore(record) : undefined
  }

  async create(
    userId: string,
    record: Generation<IBaseGenerationRecord>,
  ): Promise<Generation<IGenerationRecord>> {
    const stored = await this.persistence.create(
      StoresDB.GENERATIONS,
      record.toSnapshot(),
      userId,
    )
    return Generation.restore(stored)
  }

  async update(
    userId: string,
    record: Generation<IGenerationRecord>,
  ): Promise<Generation<IGenerationRecord>> {
    return Generation.restore(
      await this.persistence.update(
        StoresDB.GENERATIONS,
        record.toSnapshot(),
        userId,
      ),
    )
  }

  async delete(userId: string, id: GenerationId): Promise<void> {
    await this.persistence.remove(StoresDB.GENERATIONS, userId, id)
  }
}
