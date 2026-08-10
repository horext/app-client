import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(userId: string): Promise<IScheduleGenerate[]>
  addFavorite(
    userId: string,
    schedule: IBaseScheduleGenerate | IScheduleGenerate,
  ): Promise<IScheduleGenerate>
  removeFavorite(userId: string, id: string): Promise<void>
}
