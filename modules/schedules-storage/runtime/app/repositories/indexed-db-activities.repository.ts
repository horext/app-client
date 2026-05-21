import type { IBaseEvent, IEvent } from '../../shared/interfaces/event'
import type { IActivitiesRepository } from './activities.repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  static STORE_NAME = 'activities' as const
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<Array<IBaseEvent & { id: string }>> {
    const db = await this.getDb()
    return db.getAll(IndexedDBActivitiesRepository.STORE_NAME)
  }

  async get(id: string): Promise<IEvent | undefined> {
    const db = await this.getDb()
    return db.get(IndexedDBActivitiesRepository.STORE_NAME, id)
  }

  async create(activity: IBaseEvent): Promise<IEvent> {
    const db = await this.getDb()
    const id = crypto.randomUUID()
    const newActivity = { ...activity, id }
    await db.put(IndexedDBActivitiesRepository.STORE_NAME, newActivity)
    return newActivity
  }

  async update(activity: IEvent): Promise<IEvent> {
    const db = await this.getDb()
    await db.put(IndexedDBActivitiesRepository.STORE_NAME, activity)
    return activity
  }

  async putAll(activities: Array<IBaseEvent>): Promise<IEvent[]> {
    if (!activities.length) return []
    const db = await this.getDb()
    const tx = db.transaction(
      IndexedDBActivitiesRepository.STORE_NAME,
      'readwrite',
    )
    const newActivities = activities.map((a) => ({
      ...a,
      id: crypto.randomUUID(),
    }))
    await Promise.all(newActivities.map((a) => tx.store.put(a)))
    await tx.done
    return newActivities
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBActivitiesRepository.STORE_NAME, id)
  }
}
