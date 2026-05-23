import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../../shared/interfaces/generation-record'
import type { IGenerationRepository } from './generation.repository.interface'
import { type DbFactory, StoresDB } from '../context/db'

export class IndexedDBGenerationRepository implements IGenerationRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<IGenerationRecord[]> {
    const db = await this.getDb()
    return db.getAll(StoresDB.GENERATIONS)
  }

  async get(
    id: IGenerationRecord['id'],
  ): Promise<IGenerationRecord | undefined> {
    const db = await this.getDb()
    return db.get(StoresDB.GENERATIONS, id)
  }

  async create(record: IBaseGenerationRecord): Promise<IGenerationRecord> {
    const db = await this.getDb()
    const dbRecord = { ...record, id: crypto.randomUUID() }
    await db.put(StoresDB.GENERATIONS, dbRecord)
    return dbRecord
  }

  async delete(id: IGenerationRecord['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(StoresDB.GENERATIONS, id)
  }
}
