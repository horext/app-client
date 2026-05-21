import { toRaw } from 'vue'
import type { IScheduleGenerate } from '../../shared/interfaces/schedule'
import type { ISchedulesFavoritesRepository, ISchedulesRepository } from './schedules-repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  private static STORE_NAME = 'schedules' as const
  constructor(private readonly getDb: DbFactory) {}

  async getEntries(
    ids: IScheduleGenerate['id'][],
  ): Promise<IScheduleGenerate[]> {
    if (!ids.length) return []
    const db = await this.getDb()
    const tx = db.transaction(IndexedDBSchedulesRepository.STORE_NAME, 'readonly')
    const results = await Promise.all(ids.map((id) => tx.store.get(id)))
    return results.filter((s): s is IScheduleGenerate => s !== undefined)
  }

  async putEntry(schedule: IScheduleGenerate): Promise<void> {
    const db = await this.getDb()
    await db.put(IndexedDBSchedulesRepository.STORE_NAME, toRaw(schedule))
  }

  async putEntries(schedules: IScheduleGenerate[]): Promise<void> {
    if (!schedules.length) return
    const db = await this.getDb()
    const tx = db.transaction(IndexedDBSchedulesRepository.STORE_NAME, 'readwrite')
    await Promise.all(schedules.map((s) => tx.store.put(toRaw(s))))
    await tx.done
  }

  async deleteEntry(id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBSchedulesRepository.STORE_NAME, id)
  }

  async deleteEntries(ids: IScheduleGenerate['id'][]): Promise<void> {
    if (!ids.length) return
    const db = await this.getDb()
    const tx = db.transaction(IndexedDBSchedulesRepository.STORE_NAME, 'readwrite')
    await Promise.all(ids.map((id) => tx.store.delete(id)))
    await tx.done
  }
}

export class IndexedDBScheduleFavoritesRepository implements ISchedulesFavoritesRepository {
  private static FAVORITES_KEY = 'favorites' as const

  constructor(private readonly getDb: DbFactory) {}

  async getIds(): Promise<IScheduleGenerate['id'][]> {
    const db = await this.getDb()
    const records = await db.getAll(IndexedDBScheduleFavoritesRepository.FAVORITES_KEY)
    return records.map((r) => r.id)
  }

  async isInList(
    id: IScheduleGenerate['id'],
  ): Promise<boolean> {
    const db = await this.getDb()
    return (await db.get(IndexedDBScheduleFavoritesRepository.FAVORITES_KEY, id)) !== undefined
  }

  async addToList(
    id: IScheduleGenerate['id'],
  ): Promise<void> {
    const db = await this.getDb()
    await db.put(IndexedDBScheduleFavoritesRepository.FAVORITES_KEY, { id })
  }

  async removeFromList(
    id: IScheduleGenerate['id'],
  ): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBScheduleFavoritesRepository.FAVORITES_KEY, id)
  }

  async setList(
    ids: IScheduleGenerate['id'][],
  ): Promise<void> {
    const db = await this.getDb()
    const tx = db.transaction(IndexedDBScheduleFavoritesRepository.FAVORITES_KEY, 'readwrite')
    await tx.store.clear()
    await Promise.all(ids.map((id) => tx.store.put({ id })))
    await tx.done
  }
}
