import type { IAcademicConfig } from '../../shared/interfaces/academic-config'
import { AcademicConfig } from '../../shared/domain'
import type { IAcademicConfigRepository } from './academic-config.repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

const ACADEMIC_CONFIG_KEY: IAcademicConfig['id'] = 'academic-config'

export class IndexedDBAcademicConfigRepository implements IAcademicConfigRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<AcademicConfig | undefined> {
    const record = await this.persistence.find(
      StoresDB.ACADEMIC_CONFIG,
      userId,
      ACADEMIC_CONFIG_KEY,
    )
    return record ? AcademicConfig.restore(record) : undefined
  }

  async create(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    const stored = await this.persistence.create(
      StoresDB.ACADEMIC_CONFIG,
      config.toSnapshot(),
      userId,
    )
    return AcademicConfig.restore(stored)
  }

  async update(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    const stored = await this.persistence.update(
      StoresDB.ACADEMIC_CONFIG,
      config.toSnapshot(),
      userId,
    )
    return AcademicConfig.restore(stored)
  }
}
