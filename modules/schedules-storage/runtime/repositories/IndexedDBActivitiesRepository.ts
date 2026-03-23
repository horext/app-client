import { toRaw } from 'vue'
import type { IEvent } from '~/interfaces/event'
import type { IActivitiesRepository } from '../interfaces/activities-repository'
import type { DbFactory } from '../db'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<Array<IEvent & { id: string }>> {
    const db = await this.getDb()
    return db.getAll('activities')
  }

  async get(id: string): Promise<(IEvent & { id: string }) | undefined> {
    const db = await this.getDb()
    return db.get('activities', id)
  }

  async put(activity: IEvent & { id: string }): Promise<void> {
    const db = await this.getDb()
    await db.put('activities', toRaw(activity))
  }

  async putAll(activities: Array<IEvent & { id: string }>): Promise<void> {
    if (!activities.length) return
    const db = await this.getDb()
    const tx = db.transaction('activities', 'readwrite')
    await Promise.all(activities.map((a) => tx.store.put(toRaw(a))))
    await tx.done
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete('activities', id)
  }
}
