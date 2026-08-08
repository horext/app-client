import type { UUID } from 'crypto'
import { Activity } from '../../shared/domain'
import type { IActivitiesRepository } from './activities.repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async getAll(userId: string): Promise<Activity[]> {
    return (await this.persistence.findAll(StoresDB.ACTIVITIES, userId)).map(
      Activity.restore,
    )
  }

  async get(userId: string, id: UUID): Promise<Activity | undefined> {
    const record = await this.persistence.find(StoresDB.ACTIVITIES, userId, id)
    return record ? Activity.restore(record) : undefined
  }

  async create(userId: string, activity: Activity): Promise<Activity> {
    const stored = await this.persistence.create(
      StoresDB.ACTIVITIES,
      activity.toSnapshot(),
      userId,
    )
    return Activity.restore(stored)
  }

  async update(userId: string, activity: Activity): Promise<Activity> {
    const stored = await this.persistence.update(
      StoresDB.ACTIVITIES,
      activity.toSnapshot(),
      userId,
    )
    return Activity.restore(stored)
  }

  async delete(userId: string, id: UUID): Promise<void> {
    await this.persistence.remove(StoresDB.ACTIVITIES, userId, id)
  }
}
