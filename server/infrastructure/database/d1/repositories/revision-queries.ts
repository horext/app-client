import { and, eq, isNull } from 'drizzle-orm'
import { useOrm } from '../../../../database/client'
import {
  academicConfigs,
  activities,
  favorites,
  generations,
  preferences,
  profiles,
  schedules,
  userSubjects,
} from '../../../../database/schema'
import type { H3Event } from 'h3'

export async function activityRevision(
  event: H3Event,
  userId: string,
  id: string,
) {
  const [row] = await useOrm(event)
    .select({ revision: activities.revision })
    .from(activities)
    .where(
      and(
        eq(activities.userId, userId),
        eq(activities.localId, id),
        isNull(activities.deletedAt),
      ),
    )
  return row?.revision
}

export async function subjectRevision(
  event: H3Event,
  userId: string,
  id: string,
) {
  const [row] = await useOrm(event)
    .select({ revision: userSubjects.revision })
    .from(userSubjects)
    .where(
      and(
        eq(userSubjects.userId, userId),
        eq(userSubjects.localId, id),
        isNull(userSubjects.deletedAt),
      ),
    )
  return row?.revision
}
export async function scheduleRevision(
  event: H3Event,
  userId: string,
  id: string,
) {
  const [row] = await useOrm(event)
    .select({ revision: schedules.revision })
    .from(schedules)
    .where(
      and(
        eq(schedules.userId, userId),
        eq(schedules.localId, id),
        isNull(schedules.deletedAt),
      ),
    )
  return row?.revision
}
export async function generationRevision(
  event: H3Event,
  userId: string,
  id: string,
) {
  const [row] = await useOrm(event)
    .select({ revision: generations.revision })
    .from(generations)
    .where(
      and(
        eq(generations.userId, userId),
        eq(generations.localId, id),
        isNull(generations.deletedAt),
      ),
    )
  return row?.revision
}
export async function favoriteRevision(
  event: H3Event,
  userId: string,
  id: string,
) {
  const [row] = await useOrm(event)
    .select({ revision: favorites.revision })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.localId, id),
        isNull(favorites.deletedAt),
      ),
    )
  return row?.revision
}
export async function profileRevision(event: H3Event, userId: string) {
  const [row] = await useOrm(event)
    .select({ revision: profiles.revision })
    .from(profiles)
    .where(and(eq(profiles.userId, userId), isNull(profiles.deletedAt)))
  return row?.revision
}
export async function preferencesRevision(event: H3Event, userId: string) {
  const [row] = await useOrm(event)
    .select({ revision: preferences.revision })
    .from(preferences)
    .where(and(eq(preferences.userId, userId), isNull(preferences.deletedAt)))
  return row?.revision
}
export async function academicConfigRevision(event: H3Event, userId: string) {
  const [row] = await useOrm(event)
    .select({ revision: academicConfigs.revision })
    .from(academicConfigs)
    .where(
      and(
        eq(academicConfigs.userId, userId),
        isNull(academicConfigs.deletedAt),
      ),
    )
  return row?.revision
}
