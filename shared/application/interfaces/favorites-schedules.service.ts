import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { GeneratedSchedule } from '#shared/domain'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(
    userId: string,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>[]>
  addFavorite(
    userId: string,
    schedule: IBaseGeneratedSchedule | IGeneratedSchedule,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>>
  removeFavorite(userId: string, id: string): Promise<void>
}
