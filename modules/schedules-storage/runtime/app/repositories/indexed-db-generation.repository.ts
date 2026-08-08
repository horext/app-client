import type { UUID } from 'crypto'
import { Generation } from '../../shared/domain'
import type { IGenerationRepository } from './generation.repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBGenerationsRepository implements IGenerationRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async getAll(userId: string): Promise<Generation[]> {
    return (await this.persistence.findAll(StoresDB.GENERATIONS, userId)).map(
      Generation.restore,
    )
  }

  async get(userId: string, id: UUID): Promise<Generation | undefined> {
    const record = await this.persistence.find(StoresDB.GENERATIONS, userId, id)
    return record ? Generation.restore(record) : undefined
  }

  async create(userId: string, record: Generation): Promise<Generation> {
    const stored = await this.persistence.create(
      StoresDB.GENERATIONS,
      record.toSnapshot(),
      userId,
    )
    return Generation.restore(stored)
  }

  async delete(userId: string, id: UUID): Promise<void> {
    await this.persistence.remove(StoresDB.GENERATIONS, userId, id)
  }
}
