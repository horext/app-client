import type { InjectionKey } from 'vue'
import type { ISchedulesRepository } from './interfaces/schedules-repository'
import type { IGeneratedSchedulesService } from './interfaces/generated-schedules-service'
import type { IFavoritesSchedulesService } from './interfaces/favorites-schedules-service'
import type { IActivitiesService } from './interfaces/activities-service'
import type { IProfileService } from './interfaces/profile-service'
import type { IAcademicConfigService } from './interfaces/academic-config-service'
import type { IPreferencesService } from './interfaces/preferences-service'
import type { IGenerationService } from './interfaces/generation-service'
import type { DbFactory } from './db'

export const SCHEDULES_DB_KEY: InjectionKey<DbFactory> =
  Symbol('HorextDB')

export const SCHEDULES_REPOSITORY_KEY: InjectionKey<ISchedulesRepository> =
  Symbol('ISchedulesRepository')

export const GENERATED_SCHEDULES_SERVICE_KEY: InjectionKey<IGeneratedSchedulesService> =
  Symbol('IGeneratedSchedulesService')

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
