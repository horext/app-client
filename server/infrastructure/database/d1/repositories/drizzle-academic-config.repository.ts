import { and, eq, isNull } from 'drizzle-orm'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import { AcademicConfig, type BaseAcademicConfig } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import { academicConfigs, changes } from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { AcademicConfigMapper } from '~~/server/infrastructure/database/d1/mappers/domain'
import { makeUUID } from '~~/shared/domain/types/ids'

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleAcademicConfigRepository implements IAcademicConfigRepository {
  constructor(private readonly database: HorextDatabase) {}

  async get(userId: string): Promise<AcademicConfig | undefined> {
    const [row] = await this.database
      .select({ payload: academicConfigs.payloadJson })
      .from(academicConfigs)
      .where(
        and(
          eq(academicConfigs.userId, userId),
          isNull(academicConfigs.deletedAt),
        ),
      )
    return row ? AcademicConfig.reconstitute(row.payload) : undefined
  }

  async create(
    userId: string,
    entity: BaseAcademicConfig,
  ): Promise<AcademicConfig> {
    const now = new Date().toISOString()
    const value: IAcademicConfig = {
      ...AcademicConfigMapper.toCreate(entity),
      id: makeUUID<IAcademicConfig['id']>(),
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      await tx.insert(academicConfigs).values({
        localId: value.id,
        userId,
        hourlyLoadId: value.hourlyLoad?.id,
        hourlyLoadSnapshotJson: value.hourlyLoad,
        ...timestamps(value),
      })
      await tx.insert(changes).values({
        userId,
        resourceType: 'academic-config',
        recordId: value.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return AcademicConfig.reconstitute(value)
  }

  async update(
    userId: string,
    entity: AcademicConfig,
  ): Promise<AcademicConfig> {
    const expectedRevision = revision(entity.revision)
    const now = new Date().toISOString()
    const value: IAcademicConfig = {
      ...AcademicConfigMapper.toUpdate(entity),
      revision: expectedRevision + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(academicConfigs)
        .set({
          hourlyLoadId: value.hourlyLoad?.id,
          hourlyLoadSnapshotJson: value.hourlyLoad,
          payloadJson: value,
          revision: expectedRevision + 1,
          updatedAt: now,
        })
        .where(
          and(
            eq(academicConfigs.userId, userId),
            eq(academicConfigs.revision, expectedRevision),
            isNull(academicConfigs.deletedAt),
          ),
        )
        .returning({ userId: academicConfigs.userId })
      if (!updated) return staleRepositoryRevision('academic-config', value.id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'academic-config',
        recordId: value.id,
        revision: expectedRevision + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return AcademicConfig.reconstitute(value)
  }
}
