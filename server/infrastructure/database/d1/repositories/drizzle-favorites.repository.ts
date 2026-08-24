import { and, eq, isNull, sql } from 'drizzle-orm'
import type { ISchedulesFavoritesRepository } from '#shared/application/repositories/schedules.repository'
import type {
  IScheduleFavorite,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import { ScheduleFavorite, type BaseScheduleFavorite } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import { changes, favorites, schedules } from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'

function isScheduleId(value: string): value is IGeneratedSchedule['id'] {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleFavoritesRepository implements ISchedulesFavoritesRepository {
  constructor(private readonly database: HorextDatabase) {}

  async findAll(userId: string): Promise<ScheduleFavorite[]> {
    const rows = await this.database
      .select({ payload: favorites.payloadJson })
      .from(favorites)
      .where(and(eq(favorites.userId, userId), isNull(favorites.deletedAt)))
    return rows.map(({ payload }) => ScheduleFavorite.reconstitute(payload))
  }

  async getIds(userId: string): Promise<IGeneratedSchedule['id'][]> {
    const rows = await this.database
      .select({ id: favorites.localId })
      .from(favorites)
      .where(and(eq(favorites.userId, userId), isNull(favorites.deletedAt)))
    return rows.flatMap(({ id }) => (isScheduleId(id) ? [id] : []))
  }

  async findById(
    userId: string,
    id: IGeneratedSchedule['id'],
  ): Promise<ScheduleFavorite | undefined> {
    const [row] = await this.database
      .select({ payload: favorites.payloadJson })
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.localId, id),
          isNull(favorites.deletedAt),
        ),
      )
    return row ? ScheduleFavorite.reconstitute(row.payload) : undefined
  }

  async findByScheduleId(userId: string, scheduleId: IGeneratedSchedule['id']) {
    return this.findById(userId, scheduleId)
  }

  async create(userId: string, entity: BaseScheduleFavorite) {
    return this.update(userId, entity as ScheduleFavorite)
  }

  async update(
    userId: string,
    entity: ScheduleFavorite,
  ): Promise<ScheduleFavorite> {
    const now = new Date().toISOString()
    const value: IScheduleFavorite = {
      id: entity.id,
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    const revision = await this.upsert(userId, value)
    return ScheduleFavorite.reconstitute({ ...value, revision })
  }

  private async upsert(
    userId: string,
    value: IScheduleFavorite,
  ): Promise<number> {
    const id = value.id
    const now = new Date().toISOString()
    return this.database.transaction(async (tx) => {
      const [schedule] = await tx
        .select({ id: schedules.id })
        .from(schedules)
        .where(
          and(
            eq(schedules.userId, userId),
            eq(schedules.localId, id),
            isNull(schedules.deletedAt),
          ),
        )
        .limit(1)
      if (!schedule)
        throw new Error(`GeneratedSchedule ${id} was not persisted.`)
      await tx
        .insert(favorites)
        .values({
          userId,
          localId: id,
          scheduleId: schedule.id,
          ...timestamps(value),
        })
        .onConflictDoUpdate({
          target: [favorites.userId, favorites.localId],
          set: {
            payloadJson: value,
            revision: sql`${favorites.revision} + 1`,
            updatedAt: value.updatedAt,
            deletedAt: null,
          },
        })
      const [saved] = await tx
        .select({ revision: favorites.revision })
        .from(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.localId, id)))
      if (!saved) throw new Error('ScheduleFavorite was not persisted.')
      await tx.insert(changes).values({
        userId,
        resourceType: 'favorites',
        recordId: id,
        revision: saved.revision,
        operation: 'upsert',
        changedAt: now,
      })
      return saved.revision
    })
  }

  async delete(
    userId: string,
    id: IGeneratedSchedule['id'],
    expectedRevision?: number,
  ): Promise<void> {
    const expected = revision(expectedRevision)
    const now = new Date().toISOString()
    await this.database.transaction(async (tx) => {
      const [deleted] = await tx
        .update(favorites)
        .set({ revision: expected + 1, updatedAt: now, deletedAt: now })
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.localId, id),
            eq(favorites.revision, expected),
            isNull(favorites.deletedAt),
          ),
        )
        .returning({ id: favorites.localId })
      if (!deleted) return staleRepositoryRevision('favorites', id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'favorites',
        recordId: id,
        revision: expected + 1,
        operation: 'delete',
        changedAt: now,
      })
    })
  }
}
