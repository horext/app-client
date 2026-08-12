import { Favorite, type ScheduleGenerateId } from '#shared/domain'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules.repository'

export class FavoritesService {
  constructor(
    private readonly favorites: ISchedulesFavoritesRepository,
    private readonly schedules: ISchedulesRepository,
  ) {}

  get(userId: string, id: ScheduleGenerateId) {
    return this.favorites.findById(userId, id)
  }

  findByScheduleId(userId: string, scheduleId: ScheduleGenerateId) {
    return this.favorites.findByScheduleId(userId, scheduleId)
  }

  async scheduleExists(userId: string, id: ScheduleGenerateId) {
    return Boolean(await this.schedules.findBy(userId, id))
  }

  create(userId: string, scheduleId: ScheduleGenerateId) {
    return this.favorites.create(
      userId,
      Favorite.create({ scheduleId: scheduleId }),
    )
  }

  delete(userId: string, id: ScheduleGenerateId, revision: number) {
    return this.favorites.delete(userId, id, revision)
  }
}
