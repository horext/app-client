import type { IScheduleGenerate, UUID } from '~/interfaces/schedule'
import type { ISchedulesRepository } from '../interfaces/schedules-repository'
import type { IGenerationRepository } from '../interfaces/generation-repository'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules-service'

export class FavoritesSchedulesService implements IFavoritesSchedulesService {
  constructor(
    private readonly repo: ISchedulesRepository,
    private readonly generationRepo: IGenerationRepository,
  ) {}

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
    const allRecords = await this.generationRepo.getAll()
    const referencedInGenerations = allRecords.some((r) => r.scheduleIds.includes(id as UUID))
    if (!referencedInGenerations) {
      await this.repo.deleteEntry(id)
    }
  }
}
