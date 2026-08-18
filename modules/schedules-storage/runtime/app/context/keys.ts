import type { InjectionKey } from 'vue'
import type { IFavoritesSchedulesService } from '#shared/application/interfaces/favorites-schedules.service'
import type { IActivitiesService } from '#shared/application/interfaces/activities.service'
import type { IProfileService } from '#shared/application/interfaces/profile.service'
import type { IAcademicConfigService } from '#shared/application/interfaces/academic-config.service'
import type { IPreferencesService } from '#shared/application/interfaces/preferences.service'
import type { IGenerationService } from '#shared/application/interfaces/generation.service'
import type { ISubjectsService } from '#shared/application/interfaces/subjects.service'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { ILocalHourlyLoadRepository } from '#shared/application/repositories/local-hourly-load.repository'
import type { ILocalHourlyLoadService } from '#shared/application/interfaces/local-hourly-load.service'
import type { DbFactory } from './db'

export interface RawSchedulesRepositories {
  schedulesRepository: ISchedulesRepository
  activitiesRepository: IActivitiesRepository
  profileRepository: IProfileRepository
  academicConfigRepository: IAcademicConfigRepository
  preferencesRepository: IPreferencesRepository
  generationRepository: IGenerationRepository
  favoritesRepository: ISchedulesFavoritesRepository
  subjectsRepository: ISubjectsRepository
  localHourlyLoadRepository: ILocalHourlyLoadRepository
}

export interface RawSchedulesStorage extends RawSchedulesRepositories {
  db: DbFactory
}

export const USER_ID_KEY: InjectionKey<() => string> = Symbol('UserId')

export const SCHEDULES_DB_KEY: InjectionKey<DbFactory> = Symbol('HorextDB')

export const SCHEDULES_RAW_REPOSITORIES_KEY: InjectionKey<RawSchedulesRepositories> =
  Symbol('RawSchedulesRepositories')

export const SCHEDULES_REPOSITORY_KEY: InjectionKey<ISchedulesRepository> =
  Symbol('ISchedulesRepository')

export const FAVORITES_SCHEDULES_SERVICE_KEY: InjectionKey<IFavoritesSchedulesService> =
  Symbol('IFavoritesSchedulesService')

export const ACTIVITIES_SERVICE_KEY: InjectionKey<IActivitiesService> =
  Symbol('IActivitiesService')

export const PROFILE_SERVICE_KEY: InjectionKey<IProfileService> =
  Symbol('IProfileService')

export const ACADEMIC_CONFIG_SERVICE_KEY: InjectionKey<IAcademicConfigService> =
  Symbol('IAcademicConfigService')

export const PREFERENCES_SERVICE_KEY: InjectionKey<IPreferencesService> =
  Symbol('IPreferencesService')

export const GENERATION_SERVICE_KEY: InjectionKey<IGenerationService> =
  Symbol('IGenerationService')

export const SUBJECTS_SERVICE_KEY: InjectionKey<ISubjectsService> =
  Symbol('ISubjectsService')

export const LOCAL_HOURLY_LOAD_SERVICE_KEY: InjectionKey<ILocalHourlyLoadService> =
  Symbol('ILocalHourlyLoadService')
