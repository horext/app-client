import { toRaw } from 'vue'
import type { ISelectedSubject } from '../../shared/interfaces/subject'
import type { ISubjectsRepository } from './subjects-repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBSubjectsRepository implements ISubjectsRepository {
  private static STORE_NAME = 'subjects' as const

  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<ISelectedSubject[]> {
    const db = await this.getDb()
    return db.getAll(IndexedDBSubjectsRepository.STORE_NAME)
  }

  async save(subject: ISelectedSubject): Promise<void> {
    const db = await this.getDb()
    await db.put(IndexedDBSubjectsRepository.STORE_NAME, toRaw(subject))
  }

  async delete(id: ISelectedSubject['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBSubjectsRepository.STORE_NAME, id)
  }
}
