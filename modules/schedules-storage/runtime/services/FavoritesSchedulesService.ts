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
    await Promise.all(schedules.map((s) => this.repo.putEntry(s)))
    await this.repo.putIds('favorites', schedules.map((s) => s.id))
  }

  async saveFavoriteIds(ids: IScheduleGenerate['id'][]): Promise<void> {
    await this.repo.putIds('favorites', ids)
  }

  async addFavorite(schedule: IScheduleGenerate): Promise<void> {
    const favIds = await this.repo.getIds('favorites')
    await this.repo.putEntry(schedule)
    if (!favIds.includes(schedule.id)) {
      await this.repo.putIds('favorites', [...favIds, schedule.id])
    }
  }

  async removeFavorite(id: IScheduleGenerate['id']): Promise<void> {
    const [generatedIds, favIds] = await Promise.all([
      this.repo.getIds('generated'),
      this.repo.getIds('favorites'),
    ])
    await this.repo.putIds(
      'favorites',
      favIds.filter((i) => i !== id),
    )
    if (!generatedIds.includes(id)) {
      await this.repo.deleteEntry(id)
    }
  }
}
