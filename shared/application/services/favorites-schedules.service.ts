import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import { Favorite, Schedule } from '#shared/domain'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules.service'

export class FavoritesSchedulesService implements IFavoritesSchedulesService {
  constructor(
    private readonly repo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
    private readonly generationRepo: IGenerationRepository,
  ) {}

  async getFavoriteSchedules(userId: string): Promise<IScheduleGenerate[]> {
    const ids = (await this.favoritesRepo.findAll(userId)).map(
      (favorite) => favorite.id,
    )
    return (await this.repo.getEntries(userId, ids)).map((schedule) =>
      schedule.toSnapshot(),
    )
  }

  private async checkAndAddToFavorites(
    userId: string,
    createdSchedule: IScheduleGenerate,
  ) {
    const existingFavoriteSchedule = await this.favoritesRepo.findById(
      userId,
      createdSchedule.id,
    )
    if (!existingFavoriteSchedule) {
      await this.favoritesRepo.update(
        userId,
        Favorite.create({ scheduleId: createdSchedule.id }),
      )
    }
    return createdSchedule
  }

  async addFavorite(
    userId: string,
    schedule: IBaseScheduleGenerate | IScheduleGenerate,
  ): Promise<IScheduleGenerate> {
    if ('id' in schedule) {
      return await this.checkAndAddToFavorites(userId, schedule)
    }
    const existing = await this.repo.getByKey(
      userId,
      schedule.scheduleSubjectKey,
    )
    const existingSnapshot = existing?.toSnapshot()
    if (existingSnapshot?.events.length === schedule.events.length) {
      return await this.checkAndAddToFavorites(userId, existingSnapshot)
    }
    const createdSchedule = Schedule.create(schedule)
    const savedSchedule = await this.repo.create(userId, createdSchedule)
    return await this.checkAndAddToFavorites(userId, savedSchedule.toSnapshot())
  }

  async removeFavorite(
    userId: string,
    id: IScheduleGenerate['id'],
  ): Promise<void> {
    await this.favoritesRepo.delete(userId, id)
    const allRecords = await this.generationRepo.getAll(userId)
    const referencedInGenerations = allRecords.some((r) =>
      r.scheduleIds.includes(id),
    )
    if (!referencedInGenerations) {
      await this.repo.deleteEntry(userId, id)
    }
  }
}
