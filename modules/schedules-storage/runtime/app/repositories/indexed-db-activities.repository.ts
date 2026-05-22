import type { IActivity, IBaseActivity } from '../../shared/interfaces/event'
import type { IActivitiesRepository } from './activities.repository.interface'
import type { DbFactory } from '../context/db'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  static STORE_NAME = 'activities' as const
  constructor(private readonly getDb: DbFactory) {}

  async getAll(): Promise<Array<IActivity>> {
    const db = await this.getDb()
    return db.getAll(IndexedDBActivitiesRepository.STORE_NAME)
  }

  async get(id: string): Promise<IActivity | undefined> {
    const db = await this.getDb()
    return db.get(IndexedDBActivitiesRepository.STORE_NAME, id)
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
    await db.put(IndexedDBActivitiesRepository.STORE_NAME, newActivity)
    return newActivity
  }

  async update(activity: IActivity): Promise<IActivity> {
    const db = await this.getDb()
    await db.put(IndexedDBActivitiesRepository.STORE_NAME, activity)
    return activity
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete(IndexedDBActivitiesRepository.STORE_NAME, id)
  }
}
