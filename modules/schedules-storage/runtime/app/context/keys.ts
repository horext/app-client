import type { InjectionKey } from 'vue'
import type { ISchedulesRepository } from '../repositories/schedules-repository.interface'
import type { IFavoritesSchedulesService } from '../services/favorites-schedules.service.interface'
import type { IActivitiesService } from '../services/activities-service.interface'
import type { IProfileService } from '../services/profile.service.interface'
import type { IAcademicConfigService } from '../services/academic-config.service.interface'
import type { IPreferencesService } from '../services/preferences.service.interface'
import type { IGenerationService } from '../services/generation.service.interface'
import type { ISubjectsService } from '../services/subjects.service.interface'
import type { DbFactory } from './db'

export const SCHEDULES_DB_KEY: InjectionKey<DbFactory> = Symbol('HorextDB')

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
