import { ScheduleFavorite, GeneratedSchedule } from '#shared/domain'
import type {
  IBaseScheduleFavorite,
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
  GeneratedScheduleId,
} from '#shared/domain/types/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<GeneratedSchedule[]> {
    return (await this.persistence.findAll(StoresDB.SCHEDULES, userId)).map(
      GeneratedSchedule.restore,
    )
  }

  async findBy(userId: string, id: GeneratedScheduleId) {
    return this.persistence
      .find(StoresDB.SCHEDULES, userId, id)
      .then((record) =>
        record ? GeneratedSchedule.restore(record) : undefined,
      )
  }

  async getEntries(
    userId: string,
    ids: GeneratedScheduleId[],
  ): Promise<GeneratedSchedule[]> {
    if (!ids.length) return []
    const results = await Promise.all(
      ids.map((id) => this.persistence.find(StoresDB.SCHEDULES, userId, id)),
    )
    return results
      .filter((value) => value !== undefined)
      .map(GeneratedSchedule.restore)
  }

  async getByKey(
    userId: string,
    scheduleSubjectKey: string,
  ): Promise<GeneratedSchedule | undefined> {
    const result = await this.persistence.findByIndex(
      StoresDB.SCHEDULES,
      'scheduleSubjectKey',
      [userId, scheduleSubjectKey],
    )
    return result ? GeneratedSchedule.restore(result) : undefined
  }

  async create(
    userId: string,
    schedule: GeneratedSchedule<IBaseGeneratedSchedule>,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>> {
    const stored = await this.persistence.create(
      StoresDB.SCHEDULES,
      schedule.toSnapshot(),
      userId,
    )
    return GeneratedSchedule.restore(stored)
  }

  async createAll(
    userId: string,
    schedules: GeneratedSchedule<IBaseGeneratedSchedule>[],
  ): Promise<GeneratedSchedule<IGeneratedSchedule>[]> {
    if (!schedules.length) return []
    const stored: GeneratedSchedule<IGeneratedSchedule>[] = []
    for (const schedule of schedules) {
      const record = await this.persistence.create(
        StoresDB.SCHEDULES,
        schedule.toSnapshot(),
        userId,
      )
      stored.push(GeneratedSchedule.restore(record))
    }
    return stored
  }

  async update(
    userId: string,
    schedule: GeneratedSchedule<IGeneratedSchedule>,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>> {
    const stored = await this.persistence.update(
      StoresDB.SCHEDULES,
      schedule.toSnapshot(),
      userId,
    )
    return GeneratedSchedule.restore(stored)
  }

  async deleteEntry(userId: string, id: GeneratedScheduleId): Promise<void> {
    await this.persistence.remove(StoresDB.SCHEDULES, userId, id)
  }

  async deleteEntries(
    userId: string,
    ids: GeneratedScheduleId[],
  ): Promise<void> {
    if (!ids.length) return
    await Promise.all(
      ids.map((id) => this.persistence.remove(StoresDB.SCHEDULES, userId, id)),
    )
  }
}

export class IndexedDBScheduleFavoritesRepository implements ISchedulesFavoritesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<ScheduleFavorite[]> {
    const records = await this.persistence.findAll(StoresDB.FAVORITES, userId)
    return records.map(ScheduleFavorite.restore)
  }

  async findById(
    userId: string,
    id: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined> {
    const record = await this.persistence.find(StoresDB.FAVORITES, userId, id)
    return record ? ScheduleFavorite.restore(record) : undefined
  }

  async findByScheduleId(
    userId: string,
    scheduleId: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined> {
    return this.findById(userId, scheduleId)
  }

  async create(
    userId: string,
    favorite: ScheduleFavorite<IBaseScheduleFavorite>,
  ): Promise<ScheduleFavorite> {
    const stored = await this.persistence.create(
      StoresDB.FAVORITES,
      favorite.toSnapshot(),
      userId,
    )
    return ScheduleFavorite.restore(stored)
  }

  async delete(userId: string, id: GeneratedScheduleId): Promise<void> {
    await this.persistence.remove(StoresDB.FAVORITES, userId, id)
  }
}
