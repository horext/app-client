import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import { ScheduleGeneration, type BaseScheduleGeneration } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import {
  changes,
  generations,
  generationSchedules,
  schedules,
} from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { ScheduleGenerationMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleGenerationsRepository implements IGenerationRepository {
  constructor(private readonly database: HorextDatabase) {}

  async findAll(userId: string): Promise<ScheduleGeneration[]> {
    return (await this.loadAll(userId)).map(ScheduleGeneration.reconstitute)
  }

  async findById(
    userId: string,
    id: IScheduleGeneration['id'],
  ): Promise<ScheduleGeneration | undefined> {
    const value = await this.load(userId, id)
    return value ? ScheduleGeneration.reconstitute(value) : undefined
  }

  private async loadAll(userId: string): Promise<IScheduleGeneration[]> {
    const rows = await this.database
      .select({ payload: generations.payloadJson })
      .from(generations)
      .where(and(eq(generations.userId, userId), isNull(generations.deletedAt)))
      .orderBy(generations.generatedAt, generations.localId)
    return rows.map(({ payload }) => payload)
  }

  private async load(
    userId: string,
    id: IScheduleGeneration['id'],
  ): Promise<IScheduleGeneration | undefined> {
    const [row] = await this.database
      .select({ payload: generations.payloadJson })
      .from(generations)
      .where(
        and(
          eq(generations.userId, userId),
          eq(generations.localId, id),
          isNull(generations.deletedAt),
        ),
      )
    return row?.payload
  }

  async create(
    userId: string,
    entity: BaseScheduleGeneration,
  ): Promise<ScheduleGeneration> {
    const input = ScheduleGenerationMapper.toCreate(entity)
    const now = new Date().toISOString()
    const record: IScheduleGeneration = {
      ...input,
      id: input.externalId ?? makeUUID<IScheduleGeneration['id']>(),
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [stored] = await tx
        .insert(generations)
        .values({
          userId,
          localId: record.id,
          generatedAt: record.generatedAt,
          crossingsSetting: record.crossingsSetting,
          weekdaysJson: record.weekDays,
          hourlyLoadId: record.hourlyLoadId,
          resultCount: record.resultCount,
          occurrencesJson: record.occurrences,
          ...timestamps(record),
        })
        .returning({ id: generations.id })
      if (!stored) throw new Error('ScheduleGeneration was not persisted.')
      if (record.scheduleIds.length) {
        const scheduleRows = await tx
          .select({ id: schedules.id, localId: schedules.localId })
          .from(schedules)
          .where(
            and(
              eq(schedules.userId, userId),
              inArray(schedules.localId, record.scheduleIds),
            ),
          )
        const canonicalByLocal = new Map(
          scheduleRows.map((row) => [row.localId, row.id]),
        )
        await tx.insert(generationSchedules).values(
          record.scheduleIds.flatMap((scheduleId, position) => {
            const canonicalId = canonicalByLocal.get(scheduleId)
            return canonicalId
              ? [
                  {
                    userId,
                    generationId: stored.id,
                    scheduleId: canonicalId,
                    position,
                  },
                ]
              : []
          }),
        )
      }
      await tx.insert(changes).values({
        userId,
        resourceType: 'generations',
        recordId: record.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return ScheduleGeneration.reconstitute(record)
  }

  async update(
    userId: string,
    entity: ScheduleGeneration,
  ): Promise<ScheduleGeneration> {
    const expected = revision(entity.revision)
    const record = ScheduleGenerationMapper.toRecord(entity)
    const now = new Date().toISOString()
    const value: IScheduleGeneration = {
      ...record,
      revision: expected + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(generations)
        .set({
          generatedAt: record.generatedAt,
          crossingsSetting: record.crossingsSetting,
          weekdaysJson: record.weekDays,
          hourlyLoadId: record.hourlyLoadId,
          resultCount: record.resultCount,
          occurrencesJson: record.occurrences,
          payloadJson: value,
          revision: expected + 1,
          updatedAt: record.updatedAt,
        })
        .where(
          and(
            eq(generations.userId, userId),
            eq(generations.localId, record.id),
            eq(generations.revision, expected),
            isNull(generations.deletedAt),
          ),
        )
        .returning({ id: generations.id })
      if (!updated) return staleRepositoryRevision('generations', record.id)
      await tx
        .delete(generationSchedules)
        .where(
          and(
            eq(generationSchedules.userId, userId),
            eq(generationSchedules.generationId, updated.id),
          ),
        )
      if (record.scheduleIds.length) {
        const scheduleRows = await tx
          .select({ id: schedules.id, localId: schedules.localId })
          .from(schedules)
          .where(
            and(
              eq(schedules.userId, userId),
              inArray(schedules.localId, record.scheduleIds),
            ),
          )
        const canonicalByLocal = new Map(
          scheduleRows.map((row) => [row.localId, row.id]),
        )
        await tx.insert(generationSchedules).values(
          record.scheduleIds.flatMap((scheduleId, position) => {
            const canonicalId = canonicalByLocal.get(scheduleId)
            return canonicalId
              ? [
                  {
                    userId,
                    generationId: updated.id,
                    scheduleId: canonicalId,
                    position,
                  },
                ]
              : []
          }),
        )
      }
      await tx.insert(changes).values({
        userId,
        resourceType: 'generations',
        recordId: record.id,
        revision: expected + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return ScheduleGeneration.reconstitute(value)
  }

  async delete(
    userId: string,
    id: IScheduleGeneration['id'],
    expectedRevision?: number,
  ): Promise<void> {
    const expected = revision(expectedRevision)
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [deleted] = await tx
        .update(generations)
        .set({ revision: expected + 1, updatedAt: now, deletedAt: now })
        .where(
          and(
            eq(generations.userId, userId),
            eq(generations.localId, id),
            eq(generations.revision, expected),
            isNull(generations.deletedAt),
          ),
        )
        .returning({ id: generations.id })
      if (!deleted) return staleRepositoryRevision('generations', id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'generations',
        recordId: id,
        revision: expected + 1,
        operation: 'delete',
        changedAt: now,
      })
    })
  }
}
