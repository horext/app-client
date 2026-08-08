import type { InjectionKey } from 'vue'
import type { IFavoritesSchedulesService } from '../services/favorites-schedules.service.interface'
import type { IActivitiesService } from '../services/activities-service.interface'
import type { IProfileService } from '../services/profile.service.interface'
import type { IAcademicConfigService } from '../services/academic-config.service.interface'
import type { IPreferencesService } from '../services/preferences.service.interface'
import type { IGenerationService } from '../services/generation.service.interface'
import type { ISubjectsService } from '../services/subjects.service.interface'
import type { IAcademicConfigRepository } from '../repositories/academic-config.repository.interface'
import type { IActivitiesRepository } from '../repositories/activities.repository.interface'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import type { IPreferencesRepository } from '../repositories/preferences-repository.interface'
import type { IProfileRepository } from '../repositories/profile-repository.interface'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules-repository.interface'
import type { ISubjectsRepository } from '../repositories/subjects-repository.interface'
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
