import type {
  IBaseScheduleGenerate,
  IFavoriteSchedule,
  IScheduleGenerate,
} from '../../shared/interfaces/schedule'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from './schedules-repository.interface'
import { type DbFactory, StoresDB } from '../context/db'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getEntries(
    ids: IScheduleGenerate['id'][],
  ): Promise<IScheduleGenerate[]> {
    if (!ids.length) return []
    const db = await this.getDb()
    const tx = db.transaction(StoresDB.SCHEDULES, 'readonly')
    const results = await Promise.all(ids.map((id) => tx.store.get(id)))
    return results.filter((s): s is IScheduleGenerate => s !== undefined)
  }

  async getByKey(
    scheduleSubjectKey: string,
  ): Promise<IScheduleGenerate | undefined> {
    const db = await this.getDb()
    const result = await db
      .transaction(StoresDB.SCHEDULES, 'readonly')
      .store.index('scheduleSubjectKey')
      .get(scheduleSubjectKey)
    return result
  }

  async create(schedule: IBaseScheduleGenerate): Promise<IScheduleGenerate> {
    const db = await this.getDb()
    const result = { ...schedule, id: crypto.randomUUID() }
    await db.put(StoresDB.SCHEDULES, result)
    return result
  }

  async update(schedule: IScheduleGenerate): Promise<IScheduleGenerate> {
    const db = await this.getDb()
    await db.put(StoresDB.SCHEDULES, schedule)
    return schedule
  }

  async saveAll(
    schedules: IBaseScheduleGenerate[],
  ): Promise<IScheduleGenerate[]> {
    if (!schedules.length) return []
    const db = await this.getDb()
    const tx = db.transaction(StoresDB.SCHEDULES, 'readwrite')
    const results = await Promise.all(
      schedules.map((s) => {
        const result = { ...s, id: crypto.randomUUID() }
        tx.store.put(result)
        return result
      }),
    )
    await tx.done
    return results
  }

  async deleteEntry(id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(StoresDB.SCHEDULES, id)
  }

  async deleteEntries(ids: IScheduleGenerate['id'][]): Promise<void> {
    if (!ids.length) return
    const db = await this.getDb()
    const tx = db.transaction(StoresDB.SCHEDULES, 'readwrite')
    await Promise.all(ids.map((id) => tx.store.delete(id)))
    await tx.done
  }
}

export class IndexedDBScheduleFavoritesRepository implements ISchedulesFavoritesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getIds(): Promise<IScheduleGenerate['id'][]> {
    const db = await this.getDb()
    const records = await db.getAll(StoresDB.FAVORITES)
    return records.map((r) => r.id)
  }

  async findById(id: IScheduleGenerate['id']): Promise<IFavoriteSchedule | undefined> {
    const db = await this.getDb()
    return await db.get(StoresDB.FAVORITES, id)
  }

  async create(id: IScheduleGenerate['id']): Promise<IFavoriteSchedule> {
    const db = await this.getDb()
    const favorite: IFavoriteSchedule = { id }
    await db.put(StoresDB.FAVORITES, favorite)
    return favorite
  }

  async deleteById(id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(StoresDB.FAVORITES, id)
  }
}
