import type {
  IBaseAcademicConfig,
  IAcademicConfig,
} from '../../shared/interfaces/academic-config'
import { AcademicConfig } from '../../shared/domain'
import type { IAcademicConfigRepository } from './academic-config.repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBAcademicConfigRepository implements IAcademicConfigRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(
    userId: string,
  ): Promise<AcademicConfig<IAcademicConfig> | undefined> {
    const [record] = await this.persistence.findAll(
      StoresDB.ACADEMIC_CONFIG,
      userId,
    )
    return record ? AcademicConfig.restore(record) : undefined
  }

  async create(
    userId: string,
    config: AcademicConfig<IBaseAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
    const stored = await this.persistence.create(
      StoresDB.ACADEMIC_CONFIG,
      config.toSnapshot(),
      userId,
    )
    return AcademicConfig.restore(stored)
  }

  async update(
    userId: string,
    config: AcademicConfig<IAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
    const stored = await this.persistence.update(
      StoresDB.ACADEMIC_CONFIG,
      config.toSnapshot(),
      userId,
    )
    return AcademicConfig.restore(stored)
  }
}
