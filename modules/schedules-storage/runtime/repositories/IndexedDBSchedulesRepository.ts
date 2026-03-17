import { toRaw } from 'vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISchedulesRepository } from '../interfaces/schedules-repository'
import type { DbFactory } from '../db'

type MetaKey = 'generated:ids' | 'favorites:ids'
const META_KEY: Record<'generated' | 'favorites', MetaKey> = {
  generated: 'generated:ids',
  favorites: 'favorites:ids',
}

export class IndexedDBSchedulesRepository implements ISchedulesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getEntry(id: string): Promise<IScheduleGenerate | undefined> {
    const db = await this.getDb()
    return db.get('entries', id)
  }

  async getEntries(ids: string[]): Promise<IScheduleGenerate[]> {
    if (!ids.length) return []
    const db = await this.getDb()
    const tx = db.transaction('entries', 'readonly')
    const results = await Promise.all(ids.map((id) => tx.store.get(id)))
    return results.filter((s): s is IScheduleGenerate => s !== undefined)
  }

  async putEntry(schedule: IScheduleGenerate): Promise<void> {
    const db = await this.getDb()
    await db.put('entries', toRaw(schedule))
  }

  async putEntries(schedules: IScheduleGenerate[]): Promise<void> {
    if (!schedules.length) return
    const db = await this.getDb()
    const tx = db.transaction('entries', 'readwrite')
    await Promise.all(schedules.map((s) => tx.store.put(toRaw(s))))
    await tx.done
  }

  async deleteEntry(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete('entries', id)
  }

  async deleteEntries(ids: string[]): Promise<void> {
    if (!ids.length) return
    const db = await this.getDb()
    const tx = db.transaction('entries', 'readwrite')
    await Promise.all(ids.map((id) => tx.store.delete(id)))
    await tx.done
  }

  async getIds(list: 'generated' | 'favorites'): Promise<string[]> {
    const db = await this.getDb()
    return (await db.get('meta', META_KEY[list])) ?? []
  }

  async putIds(list: 'generated' | 'favorites', ids: string[]): Promise<void> {
    const db = await this.getDb()
    await db.put('meta', ids, META_KEY[list])
  }
}
