import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import {
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
  SUBJECTS_SERVICE_KEY,
} from '../context/keys'
import type { IFavoritesSchedulesService } from '../services/favorites-schedules.service.interface'
import type { IActivitiesService } from '../services/activities-service.interface'
import type { IProfileService } from '../services/profile.service.interface'
import type { IAcademicConfigService } from '../services/academic-config.service.interface'
import type { IPreferencesService } from '../services/preferences.service.interface'
import type { IGenerationService } from '../services/generation.service.interface'
import type { ISubjectsService } from '../services/subjects.service.interface'

const useService = <T>(key: InjectionKey<T>, name: string): T => {
  const service = inject(key)
  if (!service)
    throw new Error(
      `${name}: service not provided. Is the schedules-storage plugin loaded?`,
    )
  return service
}

export const useFavoritesSchedulesService = (): IFavoritesSchedulesService =>
  useService(FAVORITES_SCHEDULES_SERVICE_KEY, 'useFavoritesSchedulesService')
export const useActivitiesService = (): IActivitiesService =>
  useService(ACTIVITIES_SERVICE_KEY, 'useActivitiesService')
export const useProfileService = (): IProfileService =>
  useService(PROFILE_SERVICE_KEY, 'useProfileService')
export const useAcademicConfigService = (): IAcademicConfigService =>
  useService(ACADEMIC_CONFIG_SERVICE_KEY, 'useAcademicConfigService')
export const usePreferencesService = (): IPreferencesService =>
  useService(PREFERENCES_SERVICE_KEY, 'usePreferencesService')
export const useGenerationService = (): IGenerationService =>
  useService(GENERATION_SERVICE_KEY, 'useGenerationService')
export const useSubjectsService = (): ISubjectsService =>
  useService(SUBJECTS_SERVICE_KEY, 'useSubjectsService')
