import type { IBaseScheduleGenerate, IScheduleGenerate } from '../../shared/interfaces/schedule'

export interface IFavoritesSchedulesService {
  getFavoriteSchedules(): Promise<IScheduleGenerate[]>
  saveFavorites(schedules: IBaseScheduleGenerate[]): Promise<IScheduleGenerate[]>
  addFavorite(schedule: IBaseScheduleGenerate): Promise<IScheduleGenerate>
  removeFavorite(id: string): Promise<void>
}
