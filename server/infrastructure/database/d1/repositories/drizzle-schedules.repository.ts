import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'
import type { IGeneratedSchedule } from '#shared/domain/types/schedule'
import { GeneratedSchedule, type BaseGeneratedSchedule } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import {
  changes,
  scheduleEvents,
  schedules,
  scheduleSubjects,
} from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { GeneratedScheduleMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly database: HorextDatabase) {}

  async findAll(userId: string): Promise<GeneratedSchedule[]> {
    return (await this.loadAll(userId)).map(GeneratedSchedule.reconstitute)
  }

  async findBy(userId: string, id: IGeneratedSchedule['id']) {
    return this.database
      .select({ payload: schedules.payloadJson })
      .from(schedules)
      .where(
        and(
          eq(schedules.userId, userId),
          eq(schedules.localId, id),
          isNull(schedules.deletedAt),
        ),
      )
      .limit(1)
      .then((rows) =>
        rows[0] ? GeneratedSchedule.reconstitute(rows[0].payload) : undefined,
      )
  }

  async getEntries(
    userId: string,
    ids: IGeneratedSchedule['id'][],
  ): Promise<GeneratedSchedule[]> {
    return (await this.loadEntries(userId, ids)).map(
      GeneratedSchedule.reconstitute,
    )
  }

  async getByKey(
    userId: string,
    key: string,
  ): Promise<GeneratedSchedule | undefined> {
    const value = await this.loadByKey(userId, key)
    return value ? GeneratedSchedule.reconstitute(value) : undefined
  }

  private async loadAll(userId: string): Promise<IGeneratedSchedule[]> {
    const rows = await this.database
      .select({ payload: schedules.payloadJson })
      .from(schedules)
      .where(and(eq(schedules.userId, userId), isNull(schedules.deletedAt)))
      .orderBy(schedules.updatedAt, schedules.localId)
      .limit(500)
    return rows.map(({ payload }) => payload)
  }

  private async loadEntries(
    userId: string,
    ids: IGeneratedSchedule['id'][],
  ): Promise<IGeneratedSchedule[]> {
    if (!ids.length) return []
    const rows = await this.database
      .select({ payload: schedules.payloadJson })
      .from(schedules)
      .where(
        and(
          eq(schedules.userId, userId),
          inArray(schedules.localId, ids),
          isNull(schedules.deletedAt),
        ),
      )
    const values = rows.map(({ payload }) => payload)
    const byId = new Map(values.map((value) => [value.id, value]))
    return ids.flatMap((id) => {
      const value = byId.get(id)
      return value ? [value] : []
    })
  }

  private async loadByKey(
    userId: string,
    key: string,
  ): Promise<IGeneratedSchedule | undefined> {
    const [row] = await this.database
      .select({ payload: schedules.payloadJson })
      .from(schedules)
      .where(
        and(
          eq(schedules.userId, userId),
          eq(schedules.scheduleSubjectKey, key),
          isNull(schedules.deletedAt),
        ),
      )
      .limit(1)
    return row?.payload
  }

  async create(
    userId: string,
    entity: BaseGeneratedSchedule,
  ): Promise<GeneratedSchedule> {
    const input = GeneratedScheduleMapper.toCreate(entity)
    const now = new Date().toISOString()
    const schedule: IGeneratedSchedule = {
      ...input,
      id: input.externalId ?? makeUUID<IGeneratedSchedule['id']>(),
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [stored] = await tx
        .insert(schedules)
        .values({
          userId,
          localId: schedule.id,
          scheduleSubjectKey: schedule.scheduleSubjectKey,
          crossings: schedule.crossings,
          ...timestamps(schedule),
        })
        .returning({ id: schedules.id })
      if (!stored) throw new Error('GeneratedSchedule was not persisted.')
      if (schedule.schedulesSubject.length)
        await tx.insert(scheduleSubjects).values(
          schedule.schedulesSubject.map((item, position) => ({
            userId,
            scheduleId: stored.id,
            subjectId: item.subject.id,
            subjectScheduleId: item.id,
            position,
            snapshotJson: item,
          })),
        )
      if (schedule.events.length)
        await tx.insert(scheduleEvents).values(
          schedule.events.map((event) => ({
            userId,
            scheduleId: stored.id,
            eventId: event.id,
            title: event.title,
            category: event.category,
            type: event.type,
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            location: event.location,
            color: event.color,
          })),
        )
      await tx.insert(changes).values({
        userId,
        resourceType: 'schedules',
        recordId: schedule.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return GeneratedSchedule.reconstitute(schedule)
  }

  async update(
    userId: string,
    entity: GeneratedSchedule,
  ): Promise<GeneratedSchedule> {
    const expected = revision(entity.revision)
    const schedule = GeneratedScheduleMapper.toRecord(entity)
    const now = new Date().toISOString()
    const value: IGeneratedSchedule = {
      ...schedule,
      revision: expected + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(schedules)
        .set({
          scheduleSubjectKey: value.scheduleSubjectKey,
          crossings: value.crossings,
          payloadJson: value,
          revision: expected + 1,
          updatedAt: schedule.updatedAt,
        })
        .where(
          and(
            eq(schedules.userId, userId),
            eq(schedules.localId, schedule.id),
            eq(schedules.revision, expected),
            isNull(schedules.deletedAt),
          ),
        )
        .returning({ id: schedules.id })
      if (!updated) return staleRepositoryRevision('schedules', schedule.id)
      await tx
        .delete(scheduleSubjects)
        .where(
          and(
            eq(scheduleSubjects.userId, userId),
            eq(scheduleSubjects.scheduleId, updated.id),
          ),
        )
      await tx
        .delete(scheduleEvents)
        .where(
          and(
            eq(scheduleEvents.userId, userId),
            eq(scheduleEvents.scheduleId, updated.id),
          ),
        )
      if (schedule.schedulesSubject.length)
        await tx.insert(scheduleSubjects).values(
          schedule.schedulesSubject.map((item, position) => ({
            userId,
            scheduleId: updated.id,
            subjectId: item.subject.id,
            subjectScheduleId: item.id,
            position,
            snapshotJson: item,
          })),
        )
      if (schedule.events.length)
        await tx.insert(scheduleEvents).values(
          schedule.events.map((event) => ({
            userId,
            scheduleId: updated.id,
            eventId: event.id,
            title: event.title,
            category: event.category,
            type: event.type,
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            location: event.location,
            color: event.color,
          })),
        )
      await tx.insert(changes).values({
        userId,
        resourceType: 'schedules',
        recordId: schedule.id,
        revision: expected + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return GeneratedSchedule.reconstitute(value)
  }

  async createAll(
    userId: string,
    values: GeneratedSchedule[],
  ): Promise<GeneratedSchedule[]> {
    const saved: GeneratedSchedule[] = []
    for (const value of values) saved.push(await this.create(userId, value))
    return saved
  }

  async deleteEntry(
    userId: string,
    id: IGeneratedSchedule['id'],
    expectedRevision?: number,
  ): Promise<void> {
    const expected = revision(expectedRevision)
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [deleted] = await tx
        .update(schedules)
        .set({ revision: expected + 1, updatedAt: now, deletedAt: now })
        .where(
          and(
            eq(schedules.userId, userId),
            eq(schedules.localId, id),
            eq(schedules.revision, expected),
            isNull(schedules.deletedAt),
          ),
        )
        .returning({ id: schedules.id })
      if (!deleted) return staleRepositoryRevision('schedules', id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'schedules',
        recordId: id,
        revision: expected + 1,
        operation: 'delete',
        changedAt: now,
      })
    })
  }

  async deleteEntries(
    userId: string,
    ids: IGeneratedSchedule['id'][],
    expectedRevision?: number,
  ): Promise<void> {
    for (const id of ids) await this.deleteEntry(userId, id, expectedRevision)
  }
}
