import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../../shared/interfaces/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules-repository.interface'
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

  private async checkAndAddToFavorites(createdSchedule: IScheduleGenerate) {
    const existingFavoriteSchedule = await this.favoritesRepo.findById(createdSchedule.id)
    if (!existingFavoriteSchedule) {
      await this.favoritesRepo.create(createdSchedule.id)
    }
    return createdSchedule
  }

  async addFavorite(
    schedule: IBaseScheduleGenerate | IScheduleGenerate,
  ): Promise<IScheduleGenerate> {
    if ('id' in schedule) {
      return await this.checkAndAddToFavorites(schedule)
    }
    const existing = await this.repo.getByKey(schedule.scheduleSubjectKey)
    if (existing?.events.length === schedule.events.length) {
      return await this.checkAndAddToFavorites(existing)
    }
    const createdSchedule = await this.repo.create(schedule)
    return await this.checkAndAddToFavorites(createdSchedule)
  }

  async removeFavorite(id: IScheduleGenerate['id']): Promise<void> {
    await this.favoritesRepo.deleteById(id)
    const allRecords = await this.generationRepo.getAll()
    const referencedInGenerations = allRecords.some((r) =>
      r.scheduleIds.includes(id),
    )
    if (!referencedInGenerations) {
      await this.repo.deleteEntry(id)
    }
  }
}
