import { Favorite, Schedule } from '#shared/domain'
import type {
  IBaseFavoriteSchedule,
  IBaseScheduleGenerate,
  IScheduleGenerate,
  ScheduleGenerateId,
} from '#shared/domain/types/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<Schedule[]> {
    return (await this.persistence.findAll(StoresDB.SCHEDULES, userId)).map(
      Schedule.restore,
    )
  }

  async findBy(userId: string, id: ScheduleGenerateId) {
    return this.persistence
      .find(StoresDB.SCHEDULES, userId, id)
      .then((record) => (record ? Schedule.restore(record) : undefined))
  }

  async getEntries(
    userId: string,
    ids: ScheduleGenerateId[],
  ): Promise<Schedule[]> {
    if (!ids.length) return []
    const results = await Promise.all(
      ids.map((id) => this.persistence.find(StoresDB.SCHEDULES, userId, id)),
    )
    return results.filter((value) => value !== undefined).map(Schedule.restore)
  }

  async getByKey(
    userId: string,
    scheduleSubjectKey: string,
  ): Promise<Schedule | undefined> {
    const result = await this.persistence.findByIndex(
      StoresDB.SCHEDULES,
      'scheduleSubjectKey',
      [userId, scheduleSubjectKey],
    )
    return result ? Schedule.restore(result) : undefined
  }

  async create(
    userId: string,
    schedule: Schedule<IBaseScheduleGenerate>,
  ): Promise<Schedule<IScheduleGenerate>> {
    const stored = await this.persistence.create(
      StoresDB.SCHEDULES,
      schedule.toSnapshot(),
      userId,
    )
    return Schedule.restore(stored)
  }

  async createAll(
    userId: string,
    schedules: Schedule<IBaseScheduleGenerate>[],
  ): Promise<Schedule<IScheduleGenerate>[]> {
    if (!schedules.length) return []
    const stored: Schedule<IScheduleGenerate>[] = []
    for (const schedule of schedules) {
      const record = await this.persistence.create(
        StoresDB.SCHEDULES,
        schedule.toSnapshot(),
        userId,
      )
      stored.push(Schedule.restore(record))
    }
    return stored
  }

  async update(
    userId: string,
    schedule: Schedule<IScheduleGenerate>,
  ): Promise<Schedule<IScheduleGenerate>> {
    const stored = await this.persistence.update(
      StoresDB.SCHEDULES,
      schedule.toSnapshot(),
      userId,
    )
    return Schedule.restore(stored)
  }

  async deleteEntry(userId: string, id: ScheduleGenerateId): Promise<void> {
    await this.persistence.remove(StoresDB.SCHEDULES, userId, id)
  }

  async deleteEntries(
    userId: string,
    ids: ScheduleGenerateId[],
  ): Promise<void> {
    if (!ids.length) return
    await Promise.all(
      ids.map((id) => this.persistence.remove(StoresDB.SCHEDULES, userId, id)),
    )
  }
}

export class IndexedDBScheduleFavoritesRepository implements ISchedulesFavoritesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<Favorite[]> {
    const records = await this.persistence.findAll(StoresDB.FAVORITES, userId)
    return records.map(Favorite.restore)
  }

  async findById(
    userId: string,
    id: ScheduleGenerateId,
  ): Promise<Favorite | undefined> {
    const record = await this.persistence.find(StoresDB.FAVORITES, userId, id)
    return record ? Favorite.restore(record) : undefined
  }

  async findByScheduleId(
    userId: string,
    scheduleId: ScheduleGenerateId,
  ): Promise<Favorite | undefined> {
    return this.findById(userId, scheduleId)
  }

  async create(
    userId: string,
    favorite: Favorite<IBaseFavoriteSchedule>,
  ): Promise<Favorite> {
    const stored = await this.persistence.create(
      StoresDB.FAVORITES,
      favorite.toSnapshot(),
      userId,
    )
    return Favorite.restore(stored)
  }

  async delete(userId: string, id: ScheduleGenerateId): Promise<void> {
    await this.persistence.remove(StoresDB.FAVORITES, userId, id)
  }
}
