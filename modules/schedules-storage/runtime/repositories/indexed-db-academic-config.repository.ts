import { toRaw } from 'vue'
import type { IUserAcademicConfig } from '~/interfaces/academic-config'
import type { IAcademicConfigRepository } from './academic-config.repository.interface'
import type { DbFactory } from '../db'

const ACADEMIC_CONFIG_KEY: IUserAcademicConfig['id'] = 'academic-config'

export class IndexedDBAcademicConfigRepository implements IAcademicConfigRepository {
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<IUserAcademicConfig | undefined> {
    const db = await this.getDb()
    return db.get('academic-config', ACADEMIC_CONFIG_KEY)
  }

  async save(config: IUserAcademicConfig): Promise<void> {
    const db = await this.getDb()
    await db.put('academic-config', toRaw(config))
  }
}
