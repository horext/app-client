import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, isNull } from 'drizzle-orm'
import type { HorextDatabase } from '../../../../database/client'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IActivity } from '#shared/domain/types/event'
import { Activity, type BaseActivity } from '#shared/domain'
import {
  activities,
  activitySessions,
  changes,
} from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { ActivityMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function requiredRevision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly database: HorextDatabase) {}

  async findAll(userId: string): Promise<Activity[]> {
    return (await this.loadAll(userId)).map(Activity.reconstitute)
  }

  async findById(
    userId: string,
    id: IActivity['id'],
  ): Promise<Activity | undefined> {
    const value = await this.getSnapshot(userId, id)
    return value ? Activity.reconstitute(value) : undefined
  }

  private async loadAll(userId: string): Promise<IActivity[]> {
    const rows = await this.database
      .select({ payload: activities.payloadJson })
      .from(activities)
      .where(and(eq(activities.userId, userId), isNull(activities.deletedAt)))
      .orderBy(activities.updatedAt, activities.id)
      .limit(500)
    return rows.map(({ payload }) => payload)
  }

  private async getSnapshot(
    userId: string,
    id: IActivity['id'],
  ): Promise<IActivity | undefined> {
    const [row] = await this.database
      .select({ payload: activities.payloadJson })
      .from(activities)
      .where(
        and(
          eq(activities.userId, userId),
          eq(activities.localId, id),
          isNull(activities.deletedAt),
        ),
      )
      .limit(1)
    if (!row) return undefined
    return row.payload
  }

  async create(userId: string, entity: BaseActivity): Promise<Activity> {
    const input = ActivityMapper.toCreate(entity)
    const id = makeUUID<IActivity['id']>()
    const now = new Date().toISOString()
    const activity: IActivity = {
      ...input,
      id,
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [stored] = await tx
        .insert(activities)
        .values({
          userId,
          localId: id,
          title: activity.title,
          description: activity.description,
          location: activity.location,
          color: activity.color,
          allowOverlap: activity.allowOverlap ?? false,
          ...timestamps(activity),
        })
        .returning({ id: activities.id })
      if (!stored) throw new Error('Activity was not persisted.')
      if (activity.sessions.length)
        await tx.insert(activitySessions).values(
          activity.sessions.map((session, position) => ({
            userId,
            activityId: stored.id,
            position,
            day: session.day,
            startTime: session.startTime,
            endTime: session.endTime,
          })),
        )
      await tx.insert(changes).values({
        userId,
        resourceType: 'activities',
        recordId: id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Activity.reconstitute(activity)
  }

  async update(userId: string, entity: Activity): Promise<Activity> {
    const activity = ActivityMapper.toRecord(entity)
    const expected = requiredRevision(entity.revision)
    const now = new Date().toISOString()
    const updatedActivity: IActivity = {
      ...activity,
      revision: expected + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(activities)
        .set({
          title: updatedActivity.title,
          description: updatedActivity.description,
          location: updatedActivity.location,
          color: updatedActivity.color,
          allowOverlap: updatedActivity.allowOverlap ?? false,
          payloadJson: updatedActivity,
          revision: expected + 1,
          updatedAt: now,
        })
        .where(
          and(
            eq(activities.userId, userId),
            eq(activities.localId, activity.id),
            eq(activities.revision, expected),
            isNull(activities.deletedAt),
          ),
        )
        .returning({ id: activities.id })
      if (!updated) return staleRepositoryRevision('activities', activity.id)
      await tx
        .delete(activitySessions)
        .where(
          and(
            eq(activitySessions.userId, userId),
            eq(activitySessions.activityId, updated.id),
          ),
        )
      if (updatedActivity.sessions.length)
        await tx.insert(activitySessions).values(
          updatedActivity.sessions.map((session, position) => ({
            userId,
            activityId: updated.id,
            position,
            day: session.day,
            startTime: session.startTime,
            endTime: session.endTime,
          })),
        )
      await tx.insert(changes).values({
        userId,
        resourceType: 'activities',
        recordId: activity.id,
        revision: expected + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Activity.reconstitute(updatedActivity)
  }

  async delete(
    userId: string,
    id: IActivity['id'],
    expectedRevision?: number,
  ): Promise<void> {
    const expected = requiredRevision(expectedRevision)
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [deleted] = await tx
        .update(activities)
        .set({ revision: expected + 1, updatedAt: now, deletedAt: now })
        .where(
          and(
            eq(activities.userId, userId),
            eq(activities.localId, id),
            eq(activities.revision, expected),
            isNull(activities.deletedAt),
          ),
        )
        .returning({ id: activities.id })
      if (!deleted) return staleRepositoryRevision('activities', id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'activities',
        recordId: id,
        revision: expected + 1,
        operation: 'delete',
        changedAt: now,
      })
    })
  }
}
