import type {
  BaseGeneratedSchedule,
  BaseScheduleFavorite,
  GeneratedSchedule,
  ScheduleFavorite,
} from '#shared/domain'
import type { GeneratedScheduleId } from '#shared/domain/types/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import {
  GeneratedSchedulePersistenceMapper,
  ScheduleFavoritePersistenceMapper,
} from '../mappers/persistence'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<GeneratedSchedule[]> {
    return (await this.persistence.findAll(StoresDB.SCHEDULES, userId)).map(
      GeneratedSchedulePersistenceMapper.fromRecord,
    )
  }

  async findBy(userId: string, id: GeneratedScheduleId) {
    return this.persistence
      .find(StoresDB.SCHEDULES, userId, id)
      .then((record) =>
        record
          ? GeneratedSchedulePersistenceMapper.fromRecord(record)
          : undefined,
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
      .map(GeneratedSchedulePersistenceMapper.fromRecord)
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
    return result
      ? GeneratedSchedulePersistenceMapper.fromRecord(result)
      : undefined
  }

  async create(
    userId: string,
    schedule: BaseGeneratedSchedule,
  ): Promise<GeneratedSchedule> {
    const stored = await this.persistence.create(
      StoresDB.SCHEDULES,
      GeneratedSchedulePersistenceMapper.toCreateRecord(schedule),
      userId,
    )
    return GeneratedSchedulePersistenceMapper.fromRecord(stored)
  }

  async createAll(
    userId: string,
    schedules: BaseGeneratedSchedule[],
  ): Promise<GeneratedSchedule[]> {
    if (!schedules.length) return []
    const stored: GeneratedSchedule[] = []
    for (const schedule of schedules) {
      const record = await this.persistence.create(
        StoresDB.SCHEDULES,
        GeneratedSchedulePersistenceMapper.toCreateRecord(schedule),
        userId,
      )
      stored.push(GeneratedSchedulePersistenceMapper.fromRecord(record))
    }
    return stored
  }

  async update(
    userId: string,
    schedule: GeneratedSchedule,
  ): Promise<GeneratedSchedule> {
    const stored = await this.persistence.update(
      StoresDB.SCHEDULES,
      GeneratedSchedulePersistenceMapper.toRecord(schedule),
      userId,
    )
    return GeneratedSchedulePersistenceMapper.fromRecord(stored)
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
    return records.map(ScheduleFavoritePersistenceMapper.fromRecord)
  }

  async findById(
    userId: string,
    id: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined> {
    const record = await this.persistence.find(StoresDB.FAVORITES, userId, id)
    return record
      ? ScheduleFavoritePersistenceMapper.fromRecord(record)
      : undefined
  }

  async findByScheduleId(
    userId: string,
    scheduleId: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined> {
    return this.findById(userId, scheduleId)
  }

  async create(
    userId: string,
    favorite: BaseScheduleFavorite,
  ): Promise<ScheduleFavorite> {
    const stored = await this.persistence.create(
      StoresDB.FAVORITES,
      ScheduleFavoritePersistenceMapper.toCreateRecord(favorite),
      userId,
    )
    return ScheduleFavoritePersistenceMapper.fromRecord(stored)
  }

  async delete(userId: string, id: GeneratedScheduleId): Promise<void> {
    await this.persistence.remove(StoresDB.FAVORITES, userId, id)
  }
}
