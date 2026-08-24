import { AcademicConfigService } from '#shared/application/services/academic-config.service'
import { ActivitiesService } from '#shared/application/services/activities.service'
import { FavoritesSchedulesService } from '#shared/application/services/favorites-schedules.service'
import { GenerationService as GenerationHistoryService } from '#shared/application/services/generation.service'
import { PreferencesService } from '#shared/application/services/preferences.service'
import { ProfileService } from '#shared/application/services/profile.service'
import { SubjectsService } from '#shared/application/services/subjects.service'
import { SchedulesService } from '#shared/application/services/schedules.service'
import { FavoritesService } from '#shared/application/services/favorites.service'
import { useOrm } from '../database/client'
import { DrizzleActivitiesRepository } from '../infrastructure/database/d1/repositories/drizzle-activities.repository'
import { DrizzleSubjectsRepository } from '../infrastructure/database/d1/repositories/drizzle-subjects.repository'
import { DrizzleProfileRepository } from '../infrastructure/database/d1/repositories/drizzle-profile.repository'
import { DrizzlePreferencesRepository } from '../infrastructure/database/d1/repositories/drizzle-preferences.repository'
import { DrizzleAcademicConfigRepository } from '../infrastructure/database/d1/repositories/drizzle-academic-config.repository'
import { DrizzleSchedulesRepository } from '../infrastructure/database/d1/repositories/drizzle-schedules.repository'
import { DrizzleGenerationsRepository } from '../infrastructure/database/d1/repositories/drizzle-generations.repository'
import { DrizzleFavoritesRepository } from '../infrastructure/database/d1/repositories/drizzle-favorites.repository'
import type { H3Event } from 'h3'
import {
  ActivityMapper,
  GeneratedScheduleMapper,
  PlannedSubjectMapper,
  ScheduleGenerationMapper,
  ScheduleFavoriteMapper,
} from '~~/server/infrastructure/database/d1/mappers/domain'

function resourceAdapter<T extends { id: string }, C, P>(
  service: {
    get(userId: string, id: string): Promise<T | undefined>
    create(userId: string, value: C): Promise<T>
    patch(userId: string, id: string, value: P): Promise<T>
    delete(userId: string, id: string, revision: number): Promise<void>
  },
  mapper: (entity: T) => object,
) {
  const wrap = (entity: T) => ({
    id: entity.id,
    toSnapshot: () => mapper(entity),
  })
  return {
    get: async (userId: string, id: string) => {
      const entity = await service.get(userId, id)
      return entity && wrap(entity)
    },
    create: async (userId: string, value: C) =>
      wrap(await service.create(userId, value)),
    patch: async (userId: string, id: string, value: P) =>
      wrap(await service.patch(userId, id, value)),
    delete: service.delete.bind(service),
  }
}

export function activitiesService(event: H3Event) {
  return resourceAdapter(
    new ActivitiesService(new DrizzleActivitiesRepository(useOrm(event))),
    ActivityMapper.toRecord,
  )
}

export function subjectsService(event: H3Event) {
  return resourceAdapter(
    new SubjectsService(new DrizzleSubjectsRepository(useOrm(event))),
    PlannedSubjectMapper.toRecord,
  )
}

export const schedulesService = (event: H3Event) =>
  resourceAdapter(
    new SchedulesService(new DrizzleSchedulesRepository(useOrm(event))),
    GeneratedScheduleMapper.toRecord,
  )

export const generationsService = (event: H3Event) =>
  resourceAdapter(
    new GenerationHistoryService(
      new DrizzleGenerationsRepository(useOrm(event)),
      new DrizzleSchedulesRepository(useOrm(event)),
      new DrizzleFavoritesRepository(useOrm(event)),
    ),
    ScheduleGenerationMapper.toRecord,
  )

export function favoritesService(event: H3Event) {
  const database = useOrm(event)
  const service = new FavoritesService(
    new DrizzleFavoritesRepository(database),
    new DrizzleSchedulesRepository(database),
  )
  return {
    get: async (userId: string, id: string) => {
      const entity = await service.get(userId, id as never)
      return (
        entity && {
          toSnapshot: () => ScheduleFavoriteMapper.toRecord(entity),
        }
      )
    },
    scheduleExists: service.scheduleExists.bind(service),
    delete: service.delete.bind(service),
    create: async (userId: string, id: string) => {
      const entity = await service.create(userId, id as never)
      return {
        toSnapshot: () => ScheduleFavoriteMapper.toRecord(entity),
      }
    },
  }
}

export function generationService(event: H3Event) {
  const database = useOrm(event)
  return new GenerationHistoryService(
    new DrizzleGenerationsRepository(database),
    new DrizzleSchedulesRepository(database),
    new DrizzleFavoritesRepository(database),
  )
}

export function favoritesSchedulesService(event: H3Event) {
  const database = useOrm(event)
  return new FavoritesSchedulesService(
    new DrizzleSchedulesRepository(database),
    new DrizzleFavoritesRepository(database),
    new DrizzleGenerationsRepository(database),
  )
}

export function profileService(event: H3Event) {
  return new ProfileService(new DrizzleProfileRepository(useOrm(event)))
}

export function preferencesService(event: H3Event) {
  return new PreferencesService(new DrizzlePreferencesRepository(useOrm(event)))
}

export function academicConfigService(event: H3Event) {
  return new AcademicConfigService(
    new DrizzleAcademicConfigRepository(useOrm(event)),
  )
}
