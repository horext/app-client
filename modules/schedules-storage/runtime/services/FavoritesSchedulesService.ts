import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISchedulesRepository } from '../interfaces/schedules-repository'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules-service'

export class FavoritesSchedulesService implements IFavoritesSchedulesService {
  constructor(private readonly repo: ISchedulesRepository) {}

  async getFavoriteSchedules(): Promise<IScheduleGenerate[]> {
    const ids = await this.repo.getIds('favorites')
    return this.repo.getEntries(ids)
  }

  async saveFavorites(schedules: IScheduleGenerate[]): Promise<void> {
    await this.repo.putEntries(schedules)
    await this.repo.setList('favorites', schedules.map((s) => s.id))
  }

  async saveFavoriteIds(ids: IScheduleGenerate['id'][]): Promise<void> {
    await this.repo.setList('favorites', ids)
  }

  async addFavorite(schedule: IScheduleGenerate): Promise<void> {
    await this.repo.putEntry(schedule)
    const inList = await this.repo.isInList('favorites', schedule.id)
    if (!inList) {
      await this.repo.addToList('favorites', schedule.id)
    }
  }

  async removeFavorite(id: IScheduleGenerate['id']): Promise<void> {
    await this.repo.removeFromList('favorites', id)
    const inGenerated = await this.repo.isInList('generated', id)
    if (!inGenerated) {
      await this.repo.deleteEntry(id)
    }
  }
}
