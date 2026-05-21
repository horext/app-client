import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(): Promise<IScheduleGenerate[]>
  saveFavorites(schedules: IScheduleGenerate[]): Promise<void>
  addFavorite(schedule: IScheduleGenerate): Promise<void>
  removeFavorite(id: string): Promise<void>
}
