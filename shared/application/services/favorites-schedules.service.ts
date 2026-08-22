import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import { ScheduleFavorite, GeneratedSchedule } from '#shared/domain'
import type { IFavoritesSchedulesService } from '../interfaces/favorites-schedules.service'

export class FavoritesSchedulesService implements IFavoritesSchedulesService {
  constructor(
    private readonly repo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
    private readonly generationRepo: IGenerationRepository,
  ) {}

  async getFavoriteSchedules(userId: string): Promise<IGeneratedSchedule[]> {
    const ids = (await this.favoritesRepo.findAll(userId)).map(
      (favorite) => favorite.id,
    )
    return (await this.repo.getEntries(userId, ids)).map((schedule) =>
      schedule.toSnapshot(),
    )
  }

  private async checkAndAddToFavorites(
    userId: string,
    createdSchedule: IGeneratedSchedule,
  ) {
    const existingFavoriteSchedule = await this.favoritesRepo.findByScheduleId(
      userId,
      createdSchedule.id,
    )
    if (!existingFavoriteSchedule) {
      await this.favoritesRepo.create(
        userId,
        ScheduleFavorite.create({ scheduleId: createdSchedule.id }),
      )
    }
    return createdSchedule
  }

  async addFavorite(
    userId: string,
    schedule: IBaseGeneratedSchedule | IGeneratedSchedule,
  ): Promise<IGeneratedSchedule> {
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
    const createdSchedule = GeneratedSchedule.create(schedule)
    const savedSchedule = await this.repo.create(userId, createdSchedule)
    return await this.checkAndAddToFavorites(userId, savedSchedule.toSnapshot())
  }

  async removeFavorite(
    userId: string,
    id: IGeneratedSchedule['id'],
  ): Promise<void> {
    const favorite = await this.favoritesRepo.findByScheduleId(userId, id)
    if (favorite) await this.favoritesRepo.delete(userId, favorite.id)
    const allRecords = await this.generationRepo.findAll(userId)
    const referencedInGenerations = allRecords.some((r) =>
      r.scheduleIds.includes(id),
    )
    if (!referencedInGenerations) {
      await this.repo.deleteEntry(userId, id)
    }
  }
}
