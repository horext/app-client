import { makeUUID } from '~~/shared/domain/types/ids'
import { and, eq, isNull } from 'drizzle-orm'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { IProfile } from '#shared/domain/types/profile'
import { Profile, type BaseProfile } from '#shared/domain'
import type { HorextDatabase } from '../../../../database/client'
import { changes, profiles } from '../../../../database/schema'
import { staleRepositoryRevision, timestamps } from './repository-support'
import { ProfileMapper } from '~~/server/infrastructure/database/d1/mappers/domain'

function revision(expectedRevision?: number): number {
  if (expectedRevision === undefined)
    throw new Error('An expected revision is required for this operation.')
  return expectedRevision
}

export class DrizzleProfileRepository implements IProfileRepository {
  constructor(private readonly database: HorextDatabase) {}

  async get(userId: string): Promise<Profile | undefined> {
    const [row] = await this.database
      .select({ payload: profiles.payloadJson })
      .from(profiles)
      .where(and(eq(profiles.userId, userId), isNull(profiles.deletedAt)))
    return row ? Profile.reconstitute(row.payload) : undefined
  }

  async create(userId: string, entity: BaseProfile): Promise<Profile> {
    const now = new Date().toISOString()
    const value: IProfile = {
      ...ProfileMapper.toCreate(entity),
      setupCompleted: entity.setupCompleted ?? false,
      id: makeUUID<IProfile['id']>(),
      revision: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      await tx.insert(profiles).values({
        localId: value.id,
        userId,
        facultyId: value.facultyId,
        specialityId: value.specialityId,
        setupCompleted: value.setupCompleted,
        ...timestamps(value),
      })
      await tx.insert(changes).values({
        userId,
        resourceType: 'profile',
        recordId: value.id,
        revision: 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Profile.reconstitute(value)
  }

  async update(userId: string, entity: Profile): Promise<Profile> {
    const expectedRevision = revision(entity.revision)
    const now = new Date().toISOString()
    const value: IProfile = {
      ...ProfileMapper.toRecord(entity),
      revision: expectedRevision + 1,
      updatedAt: now,
      updatedBy: userId,
    }
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(profiles)
        .set({
          facultyId: value.facultyId,
          specialityId: value.specialityId,
          setupCompleted: value.setupCompleted,
          payloadJson: value,
          revision: expectedRevision + 1,
          updatedAt: now,
        })
        .where(
          and(
            eq(profiles.userId, userId),
            eq(profiles.revision, expectedRevision),
            isNull(profiles.deletedAt),
          ),
        )
        .returning({ userId: profiles.userId })
      if (!updated) return staleRepositoryRevision('profile', value.id)
      await tx.insert(changes).values({
        userId,
        resourceType: 'profile',
        recordId: value.id,
        revision: expectedRevision + 1,
        operation: 'upsert',
        changedAt: now,
      })
    })
    return Profile.reconstitute(value)
  }
}
