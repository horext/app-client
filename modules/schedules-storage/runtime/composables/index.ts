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
import type { IGeneratedSchedulesService } from '../interfaces/generated-schedules-service'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules-service'
import type { IActivitiesService } from '../interfaces/activities-service'
import type { IProfileService } from '../interfaces/profile-service'
import type { IAcademicConfigService } from '../interfaces/academic-config-service'
import type { IPreferencesService } from '../interfaces/preferences-service'
import type { IGenerationService } from '../interfaces/generation-service'

export const useGeneratedSchedulesService = (): IGeneratedSchedulesService => {
  const service = inject(GENERATED_SCHEDULES_SERVICE_KEY)
  if (!service) throw new Error('useGeneratedSchedulesService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const useFavoritesSchedulesService = (): IFavoritesSchedulesService => {
  const service = inject(FAVORITES_SCHEDULES_SERVICE_KEY)
  if (!service) throw new Error('useFavoritesSchedulesService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const useActivitiesService = (): IActivitiesService => {
  const service = inject(ACTIVITIES_SERVICE_KEY)
  if (!service) throw new Error('useActivitiesService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const useProfileService = (): IProfileService => {
  const service = inject(PROFILE_SERVICE_KEY)
  if (!service) throw new Error('useProfileService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const useAcademicConfigService = (): IAcademicConfigService => {
  const service = inject(ACADEMIC_CONFIG_SERVICE_KEY)
  if (!service) throw new Error('useAcademicConfigService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const usePreferencesService = (): IPreferencesService => {
  const service = inject(PREFERENCES_SERVICE_KEY)
  if (!service) throw new Error('usePreferencesService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
export const useGenerationService = (): IGenerationService => {
  const service = inject(GENERATION_SERVICE_KEY)
  if (!service) throw new Error('useGenerationService: service not provided. Is the schedules-storage plugin loaded?')
  return service
}
