import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(userId: string): Promise<IGeneratedSchedule[]>
  addFavorite(
    userId: string,
    schedule: IBaseGeneratedSchedule | IGeneratedSchedule,
  ): Promise<IGeneratedSchedule>
  removeFavorite(userId: string, id: string): Promise<void>
}
