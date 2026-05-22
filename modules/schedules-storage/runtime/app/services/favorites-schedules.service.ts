import type { IBaseScheduleGenerate, IScheduleGenerate } from '../../shared/interfaces/schedule'
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

  async saveFavorites(schedules: IScheduleGenerate[]): Promise<IScheduleGenerate[]> {
    const savedSchedules = await this.repo.saveAll(schedules)
    await this.favoritesRepo.setList(savedSchedules.map((s) => s.id))
    return savedSchedules
  }

  private async checkAndAddToFavorites(createdSchedule: IScheduleGenerate) {
    const inList = await this.favoritesRepo.isInList(createdSchedule.id)
    if (!inList) {
      await this.favoritesRepo.addToList(createdSchedule.id)
    }
    return createdSchedule
  }

  async addFavorite(schedule: IBaseScheduleGenerate | IScheduleGenerate): Promise<IScheduleGenerate> {
    if ('id' in schedule) {
      return await this.checkAndAddToFavorites(schedule)
    }
    const createdSchedule = await this.repo.create(schedule)
    return await this.checkAndAddToFavorites(createdSchedule)
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
