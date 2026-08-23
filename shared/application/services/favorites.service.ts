import { ScheduleFavorite, type GeneratedScheduleId } from '#shared/domain'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules.repository'

export class FavoritesService {
  constructor(
    private readonly favorites: ISchedulesFavoritesRepository,
    private readonly schedules: ISchedulesRepository,
  ) {}

  get(userId: string, id: GeneratedScheduleId) {
    return this.favorites.findById(userId, id)
  }

  findByScheduleId(userId: string, scheduleId: GeneratedScheduleId) {
    return this.favorites.findByScheduleId(userId, scheduleId)
  }

  async scheduleExists(userId: string, id: GeneratedScheduleId) {
    return Boolean(await this.schedules.findBy(userId, id))
  }

  create(userId: string, scheduleId: GeneratedScheduleId) {
    return this.favorites.create(
      userId,
      ScheduleFavorite.create({ scheduleId: scheduleId }),
    )
  }

  delete(userId: string, id: GeneratedScheduleId, revision: number) {
    return this.favorites.delete(userId, id, revision)
  }
}
