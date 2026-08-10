import type { UUID } from 'crypto'
import { Favorite } from '#shared/domain'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules.repository'

export class FavoritesService {
  constructor(
    private readonly favorites: ISchedulesFavoritesRepository,
    private readonly schedules: ISchedulesRepository,
  ) {}

  get(userId: string, id: string) {
    return this.favorites.findById(userId, id as UUID)
  }

  async scheduleExists(userId: string, id: string) {
    return Boolean(await this.schedules.findBy(userId, id as UUID))
  }

  create(userId: string, id: string) {
    return this.favorites.update(
      userId,
      Favorite.create({ scheduleId: id as UUID }),
    )
  }

  delete(userId: string, id: string, revision: number) {
    return this.favorites.delete(userId, id as UUID, revision)
  }
}
