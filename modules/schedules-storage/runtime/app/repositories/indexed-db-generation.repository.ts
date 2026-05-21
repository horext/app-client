import type { IGenerationRecord } from '../../shared/interfaces/generation-record'
import type { IGenerationRepository } from './generation.repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBGenerationRepository implements IGenerationRepository {
  private static STORE_NAME = 'generations' as const
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<IGenerationRecord[]> {
    const db = await this.getDb()
    return db.getAll(IndexedDBGenerationRepository.STORE_NAME)
  }

  async get(id: string): Promise<IGenerationRecord | undefined> {
    const db = await this.getDb()
    return db.get(IndexedDBGenerationRepository.STORE_NAME, id)
  }

  async save(record: IGenerationRecord): Promise<void> {
    const db = await this.getDb()
    await db.put(IndexedDBGenerationRepository.STORE_NAME, record)
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBGenerationRepository.STORE_NAME, id)
  }
}
