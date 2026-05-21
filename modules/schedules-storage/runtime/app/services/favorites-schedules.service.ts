import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISchedulesFavoritesRepository, ISchedulesRepository } from '../repositories/schedules-repository.interface'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import type { IFavoritesSchedulesService } from './favorites-schedules.service.interface'

export class FavoritesSchedulesService implements IFavoritesSchedulesService {
  constructor(
    private readonly repo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
    private readonly generationRepo: IGenerationRepository,
  ) {}

  async getFavoriteSchedules(): Promise<IScheduleGenerate[]> {
    const ids = await this.favoritesRepo.getIds()
    return this.repo.getEntries(ids)
  }

  async saveFavorites(schedules: IScheduleGenerate[]): Promise<void> {
    await this.repo.putEntries(schedules)
    await this.favoritesRepo.setList(schedules.map((s) => s.id))
  }

  async addFavorite(schedule: IScheduleGenerate): Promise<void> {
    await this.repo.putEntry(schedule)
    const inList = await this.favoritesRepo.isInList(schedule.id)
    if (!inList) {
      await this.favoritesRepo.addToList(schedule.id)
    }
  }

  async removeFavorite(id: IScheduleGenerate['id']): Promise<void> {
    await this.favoritesRepo.removeFromList(id)
    const allRecords = await this.generationRepo.getAll()
    const referencedInGenerations = allRecords.some((r) =>
      r.scheduleIds.includes(id),
    )
    if (!referencedInGenerations) {
      await this.repo.deleteEntry(id)
    }
  }
}
