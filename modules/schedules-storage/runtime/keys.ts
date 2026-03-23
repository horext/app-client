import type { InjectionKey } from 'vue'
import type { ISchedulesRepository } from './interfaces/schedules-repository'
import type { IGeneratedSchedulesService } from './interfaces/generated-schedules-service'
import type { IFavoritesSchedulesService } from './interfaces/favorites-schedules-service'
import type { IActivitiesService } from './interfaces/activities-service'
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
