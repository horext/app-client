import { inject } from 'vue'
import {
  GENERATED_SCHEDULES_SERVICE_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
} from '../keys'
import type { IGeneratedSchedulesService } from '../services/generated-schedules.service.interface'
import type { IFavoritesSchedulesService } from '../services/favorites-schedules.service.interface'
import type { IActivitiesService } from '../services/activities-service.interface'
import type { IProfileService } from '../services/profile.service.interface'
import type { IAcademicConfigService } from '../services/academic-config.service.interface'
import type { IPreferencesService } from '../services/preferences.service.interface'
import type { IGenerationService } from '../services/generation.service.interface'

export const useGeneratedSchedulesService = (): IGeneratedSchedulesService => {
  const service = inject(GENERATED_SCHEDULES_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useGeneratedSchedulesService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const useFavoritesSchedulesService = (): IFavoritesSchedulesService => {
  const service = inject(FAVORITES_SCHEDULES_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useFavoritesSchedulesService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const useActivitiesService = (): IActivitiesService => {
  const service = inject(ACTIVITIES_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useActivitiesService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const useProfileService = (): IProfileService => {
  const service = inject(PROFILE_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useProfileService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const useAcademicConfigService = (): IAcademicConfigService => {
  const service = inject(ACADEMIC_CONFIG_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useAcademicConfigService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const usePreferencesService = (): IPreferencesService => {
  const service = inject(PREFERENCES_SERVICE_KEY)
  if (!service)
    throw new Error(
      'usePreferencesService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
export const useGenerationService = (): IGenerationService => {
  const service = inject(GENERATION_SERVICE_KEY)
  if (!service)
    throw new Error(
      'useGenerationService: service not provided. Is the schedules-storage plugin loaded?',
    )
  return service
}
