import { toRaw } from 'vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISchedulesRepository } from '../interfaces/schedules-repository'
import type { DbFactory } from '../db'

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getEntry(id: IScheduleGenerate['id']): Promise<IScheduleGenerate | undefined> {
    const db = await this.getDb()
    return db.get('schedules', id)
  }

  async getEntries(ids: IScheduleGenerate['id'][]): Promise<IScheduleGenerate[]> {
    if (!ids.length) return []
    const db = await this.getDb()
    const tx = db.transaction('schedules', 'readonly')
    const results = await Promise.all(ids.map((id) => tx.store.get(id)))
    return results.filter((s): s is IScheduleGenerate => s !== undefined)
  }

  async putEntry(schedule: IScheduleGenerate): Promise<void> {
    const db = await this.getDb()
    await db.put('schedules', toRaw(schedule))
  }

  async putEntries(schedules: IScheduleGenerate[]): Promise<void> {
    if (!schedules.length) return
    const db = await this.getDb()
    const tx = db.transaction('schedules', 'readwrite')
    await Promise.all(schedules.map((s) => tx.store.put(toRaw(s))))
    await tx.done
  }

  async deleteEntry(id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete('schedules', id)
  }

  async deleteEntries(ids: IScheduleGenerate['id'][]): Promise<void> {
    if (!ids.length) return
    const db = await this.getDb()
    const tx = db.transaction('schedules', 'readwrite')
    await Promise.all(ids.map((id) => tx.store.delete(id)))
    await tx.done
  }

  async getIds(list: 'generated' | 'favorites'): Promise<IScheduleGenerate['id'][]> {
    const db = await this.getDb()
    const records = await db.getAll(list)
    return records.map((r) => r.id)
  }

  async isInList(list: 'generated' | 'favorites', id: IScheduleGenerate['id']): Promise<boolean> {
    const db = await this.getDb()
    return (await db.get(list, id)) !== undefined
  }

  async addToList(list: 'generated' | 'favorites', id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.put(list, { id })
  }

  async removeFromList(list: 'generated' | 'favorites', id: IScheduleGenerate['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(list, id)
  }

  async setList(list: 'generated' | 'favorites', ids: IScheduleGenerate['id'][]): Promise<void> {
    const db = await this.getDb()
    const tx = db.transaction(list, 'readwrite')
    await tx.store.clear()
    await Promise.all(ids.map((id) => tx.store.put({ id })))
    await tx.done
  }
}
