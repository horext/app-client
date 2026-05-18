import type { IGenerationRecord } from '~/interfaces/generation-record'
import type { IGenerationRepository } from './generation.repository.interface'
import type { DbFactory } from '../db'

export class IndexedDBGenerationRepository implements IGenerationRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<IGenerationRecord[]> {
    const db = await this.getDb()
    return db.getAll('generations')
  }

  async get(id: string): Promise<IGenerationRecord | undefined> {
    const db = await this.getDb()
    return db.get('generations', id)
  }

  async save(record: IGenerationRecord): Promise<void> {
    const db = await this.getDb()
    await db.put('generations', record)
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete('generations', id)
  }
}
