import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { GeneratedSchedule } from '#shared/domain'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(userId: string): Promise<GeneratedSchedule[]>
  addFavorite(
    userId: string,
    schedule: IBaseGeneratedSchedule | IGeneratedSchedule,
  ): Promise<GeneratedSchedule>
  removeFavorite(userId: string, id: string): Promise<void>
}
