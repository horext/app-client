import { inject } from 'vue'
import {
  GENERATED_SCHEDULES_SERVICE_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
} from '../keys'
import type { IGeneratedSchedulesService } from '../interfaces/generated-schedules-service'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules-service'

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
