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
  USER_ID_KEY,
} from '../context'
import type { IFavoritesSchedulesService } from '#shared/application/interfaces/favorites-schedules.service'
import type { IActivitiesService } from '#shared/application/interfaces/activities.service'
import type { IProfileService } from '#shared/application/interfaces/profile.service'
import type { IAcademicConfigService } from '#shared/application/interfaces/academic-config.service'
import type { IPreferencesService } from '#shared/application/interfaces/preferences.service'
import type { IGenerationService } from '#shared/application/interfaces/generation.service'
import type { ISubjectsService } from '#shared/application/interfaces/subjects.service'

const useService = <T>(key: InjectionKey<T>, name: string): T => {
  const service = inject(key)
  if (!service)
    throw new Error(
      `${name}: service not provided. Is the schedules-storage plugin loaded?`,
    )
  return service
}

export const useSchedulesUserId = (): string => {
  const userId = inject(USER_ID_KEY)
  return userId?.() ?? 'anonymous'
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
