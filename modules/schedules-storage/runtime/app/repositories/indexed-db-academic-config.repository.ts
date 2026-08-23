import type { AcademicConfig, BaseAcademicConfig } from '#shared/domain'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { AcademicConfigPersistenceMapper } from '../mappers/persistence'

export class IndexedDBAcademicConfigRepository implements IAcademicConfigRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<AcademicConfig | undefined> {
    const [record] = await this.persistence.findAll(
      StoresDB.ACADEMIC_CONFIG,
      userId,
    )
    return record
      ? AcademicConfigPersistenceMapper.fromRecord(record)
      : undefined
  }

  async create(
    userId: string,
    config: BaseAcademicConfig,
  ): Promise<AcademicConfig> {
    const stored = await this.persistence.create(
      StoresDB.ACADEMIC_CONFIG,
      AcademicConfigPersistenceMapper.toCreateRecord(config),
      userId,
    )
    return AcademicConfigPersistenceMapper.fromRecord(stored)
  }

  async update(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    const stored = await this.persistence.update(
      StoresDB.ACADEMIC_CONFIG,
      AcademicConfigPersistenceMapper.toRecord(config),
      userId,
    )
    return AcademicConfigPersistenceMapper.fromRecord(stored)
  }
}
