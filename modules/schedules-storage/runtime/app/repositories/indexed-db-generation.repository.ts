import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../../shared/interfaces/generation-record'
import type { IGenerationRepository } from './generation.repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBGenerationRepository implements IGenerationRepository {
  private static STORE_NAME = 'generations' as const
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<IGenerationRecord[]> {
    const db = await this.getDb()
    return db.getAll(IndexedDBGenerationRepository.STORE_NAME)
  }

  async get(
    id: IGenerationRecord['id'],
  ): Promise<IGenerationRecord | undefined> {
    const db = await this.getDb()
    return db.get(IndexedDBGenerationRepository.STORE_NAME, id)
  }

  async create(record: IBaseGenerationRecord): Promise<IGenerationRecord> {
    const db = await this.getDb()
    const dbRecord = { ...record, id: crypto.randomUUID() }
    await db.put(IndexedDBGenerationRepository.STORE_NAME, dbRecord)
    return dbRecord
  }

  async delete(id: IGenerationRecord['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBGenerationRepository.STORE_NAME, id)
  }
}
