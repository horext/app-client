import type { IActivity, IBaseActivity } from '../../shared/interfaces/event'
import type { IActivitiesRepository } from './activities.repository.interface'
import { type DbFactory, StoresDB } from '../context/db'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<Array<IActivity>> {
    const db = await this.getDb()
    return db.getAll(StoresDB.ACTIVITIES)
  }

  async get(id: IActivity['id']): Promise<IActivity | undefined> {
    const db = await this.getDb()
    return db.get(StoresDB.ACTIVITIES, id)
  }

  async create(activity: IBaseActivity): Promise<IActivity> {
    const db = await this.getDb()
    const id = crypto.randomUUID()
    const newActivity: IActivity = {
      ...activity,
      id,
      category: 'MY_EVENT',
      type: 'MY_EVENT',
    }
    await db.put(StoresDB.ACTIVITIES, newActivity)
    return newActivity
  }

  async update(activity: IActivity): Promise<IActivity> {
    const db = await this.getDb()
    await db.put(StoresDB.ACTIVITIES, activity)
    return activity
  }

  async delete(id: IActivity['id']): Promise<void> {
    const db = await this.getDb()
    await db.delete(StoresDB.ACTIVITIES, id)
  }
}
