import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, isNull } from 'drizzle-orm'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import { PlannedSubject, type BasePlannedSubject } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import {
  changes,
  userSubjects,
  userSubjectSchedules,
  userSubjectSessions,
} from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { PlannedSubjectMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function requiredRevision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleSubjectsRepository implements ISubjectsRepository {
  constructor(private readonly database: HorextDatabase) {}

  async findAll(userId: string): Promise<PlannedSubject[]> {
    return (await this.loadAll(userId)).map(PlannedSubject.reconstitute)
  }

  private async loadAll(userId: string): Promise<IPlannedSubject[]> {
    const rows = await this.database
      .select({ payload: userSubjects.payloadJson })
      .from(userSubjects)
      .where(
        and(eq(userSubjects.userId, userId), isNull(userSubjects.deletedAt)),
      )
      .orderBy(userSubjects.updatedAt, userSubjects.id)
    return rows.map(({ payload }) => payload)
  }

  async findById(
    userId: string,
    id: IPlannedSubject['id'],
  ): Promise<PlannedSubject | undefined> {
    const [row] = await this.database
      .select({ payload: userSubjects.payloadJson })
      .from(userSubjects)
      .where(
        and(
          eq(userSubjects.userId, userId),
          eq(userSubjects.localId, id),
          isNull(userSubjects.deletedAt),
        ),
      )
    return row ? PlannedSubject.reconstitute(row.payload) : undefined
  }

  async create(
    userId: string,
    entity: BasePlannedSubject,
  ): Promise<PlannedSubject> {
    const input = PlannedSubjectMapper.toCreate(entity)
    const id = makeUUID<IPlannedSubject['id']>()
    const now = new Date().toISOString()
    const subject: IPlannedSubject = {
      ...input,
      id,
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.insert(userId, subject)
    return PlannedSubject.reconstitute(subject)
  }

  private async insert(
    userId: string,
    subject: IPlannedSubject,
  ): Promise<void> {
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [stored] = await tx
        .insert(userSubjects)
        .values({
          userId,
          localId: subject.id,
          subjectId: subject.subject.id,
          color: subject.color,
          subjectSnapshotJson: subject.subject,
          ...timestamps(subject),
        })
        .returning({ id: userSubjects.id })
      if (!stored) throw new Error('Subject was not persisted.')
      if (subject.schedules.length)
        await tx.insert(userSubjectSchedules).values(
          subject.schedules.map((schedule, position) => ({
            userId,
            userSubjectId: stored.id,
            scheduleId: schedule.id,
            sectionId: schedule.section.id,
            scheduleSubjectId: schedule.scheduleSubject.id,
            position,
          })),
        )
      const sessions = subject.schedules.flatMap((schedule) =>
        schedule.sessions.map((session, position) => ({
          userId,
          userSubjectId: stored.id,
          scheduleId: schedule.id,
          sessionId: session.id,
          position,
          classroomJson: session.classroom,
          teacherJson: session.teacher ?? null,
          typeJson: session.type,
          day: session.day,
          startTime: session.startTime,
          endTime: session.endTime,
        })),
      )
      if (sessions.length) await tx.insert(userSubjectSessions).values(sessions)
      await tx.insert(changes).values({
        userId,
        resourceType: 'subjects',
        recordId: subject.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
  }

  async update(
    userId: string,
    entity: PlannedSubject,
  ): Promise<PlannedSubject> {
    const subject = PlannedSubjectMapper.toRecord(entity)
    const expected = requiredRevision(entity.revision)
    const now = new Date().toISOString()
    const updatedSubject: IPlannedSubject = {
      ...subject,
      revision: expected + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(userSubjects)
        .set({
          subjectId: updatedSubject.subject.id,
          color: updatedSubject.color,
          subjectSnapshotJson: updatedSubject.subject,
          payloadJson: updatedSubject,
          revision: expected + 1,
          updatedAt: now,
        })
        .where(
          and(
            eq(userSubjects.userId, userId),
            eq(userSubjects.localId, subject.id),
            eq(userSubjects.revision, expected),
            isNull(userSubjects.deletedAt),
          ),
        )
        .returning({ id: userSubjects.id })
      if (!updated) return staleRepositoryRevision('subjects', subject.id)
      await tx
        .delete(userSubjectSchedules)
        .where(
          and(
            eq(userSubjectSchedules.userId, userId),
            eq(userSubjectSchedules.userSubjectId, subject.id),
          ),
        )
      if (updatedSubject.schedules.length)
        await tx.insert(userSubjectSchedules).values(
          updatedSubject.schedules.map((schedule, position) => ({
            userId,
            userSubjectId: updated.id,
            scheduleId: schedule.id,
            sectionId: schedule.section.id,
            scheduleSubjectId: schedule.scheduleSubject.id,
            position,
          })),
        )
      const sessions = updatedSubject.schedules.flatMap((schedule) =>
        schedule.sessions.map((session, position) => ({
          userId,
          userSubjectId: updated.id,
          scheduleId: schedule.id,
          sessionId: session.id,
          position,
          classroomJson: session.classroom,
          teacherJson: session.teacher ?? null,
          typeJson: session.type,
          day: session.day,
          startTime: session.startTime,
          endTime: session.endTime,
        })),
      )
      if (sessions.length) await tx.insert(userSubjectSessions).values(sessions)
      await tx.insert(changes).values({
        userId,
        resourceType: 'subjects',
        recordId: subject.id,
        revision: expected + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return PlannedSubject.reconstitute(updatedSubject)
  }

  async delete(
    userId: string,
    id: IPlannedSubject['id'],
    expectedRevision?: number,
  ): Promise<void> {
    const expected = requiredRevision(expectedRevision)
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [deleted] = await tx
        .update(userSubjects)
        .set({
          revision: expected + 1,
          updatedAt: now,
          deletedAt: now,
        })
        .where(
          and(
            eq(userSubjects.userId, userId),
            eq(userSubjects.localId, id),
            eq(userSubjects.revision, expected),
            isNull(userSubjects.deletedAt),
          ),
        )
        .returning({ id: userSubjects.id })
      if (!deleted) return staleRepositoryRevision('subjects', id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'subjects',
        recordId: id,
        revision: expected + 1,
        operation: 'delete',
        changedAt: now,
      })
    })
  }
}
