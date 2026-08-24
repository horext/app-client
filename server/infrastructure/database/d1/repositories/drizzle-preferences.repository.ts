import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, isNull } from 'drizzle-orm'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IPreferences } from '#shared/domain/types/preferences'
import { Preferences, type BasePreferences } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import { changes, preferences } from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { PreferencesMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzlePreferencesRepository implements IPreferencesRepository {
  constructor(private readonly database: HorextDatabase) {}

  async get(userId: string): Promise<Preferences | undefined> {
    const [row] = await this.database
      .select({ payload: preferences.payloadJson })
      .from(preferences)
      .where(and(eq(preferences.userId, userId), isNull(preferences.deletedAt)))
    return row ? Preferences.reconstitute(row.payload) : undefined
  }

  async create(userId: string, entity: BasePreferences): Promise<Preferences> {
    const now = new Date().toISOString()
    const value: IPreferences = {
      ...PreferencesMapper.toCreate(entity),
      id: makeUUID<IPreferences['id']>(),
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      await tx.insert(preferences).values({
        localId: value.id,
        userId,
        weekdaysJson: value.weekDays,
        crossings: value.crossings,
        maxGenerationHistory: value.maxGenerationHistory,
        ...timestamps(value),
      })
      await tx.insert(changes).values({
        userId,
        resourceType: 'preferences',
        recordId: value.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Preferences.reconstitute(value)
  }

  async update(userId: string, entity: Preferences): Promise<Preferences> {
    const expectedRevision = revision(entity.revision)
    const now = new Date().toISOString()
    const value: IPreferences = {
      ...PreferencesMapper.toRecord(entity),
      revision: expectedRevision + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(preferences)
        .set({
          weekdaysJson: value.weekDays,
          crossings: value.crossings,
          maxGenerationHistory: value.maxGenerationHistory,
          payloadJson: value,
          revision: expectedRevision + 1,
          updatedAt: now,
        })
        .where(
          and(
            eq(preferences.userId, userId),
            eq(preferences.revision, expectedRevision),
            isNull(preferences.deletedAt),
          ),
        )
        .returning({ userId: preferences.userId })
      if (!updated) return staleRepositoryRevision('preferences', value.id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'preferences',
        recordId: value.id,
        revision: expectedRevision + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Preferences.reconstitute(value)
  }
}
