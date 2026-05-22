import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '../../shared/interfaces/subject'
import type { ISubjectsRepository } from './subjects-repository.interface'
import { type DbFactory, StoresDB } from '../context/db'

export class IndexedDBSubjectsRepository implements ISubjectsRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<ISubjectSchedules[]> {
    const db = await this.getDb()
    return db.getAll(StoresDB.SUBJECTS)
  }

  async create(subject: IBaseSubjectSchedules): Promise<ISubjectSchedules> {
    const data = {
      ...subject,
      id: crypto.randomUUID(),
    }
    return this.update(data)
  }

  async delete(id: ISubjectSchedules['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(StoresDB.SUBJECTS, id)
  }

  async update(subject: ISubjectSchedules): Promise<ISubjectSchedules> {
    console.log('Updating subject in IndexedDB:', subject)
    const db = await this.getDb()
    await db.put(StoresDB.SUBJECTS, subject)
    return subject
  }
}
