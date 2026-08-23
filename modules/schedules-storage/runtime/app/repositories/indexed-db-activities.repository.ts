import type { Activity, BaseActivity } from '#shared/domain'
import type { ActivityID } from '#shared/domain/types/event'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { ActivityPersistenceMapper } from '../mappers/persistence'

export class IndexedDBActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async findAll(userId: string): Promise<Activity[]> {
    return (await this.persistence.findAll(StoresDB.ACTIVITIES, userId)).map(
      ActivityPersistenceMapper.fromRecord,
    )
  }

  async findById(
    userId: string,
    id: ActivityID,
  ): Promise<Activity | undefined> {
    const record = await this.persistence.find(StoresDB.ACTIVITIES, userId, id)
    return record ? ActivityPersistenceMapper.fromRecord(record) : undefined
  }

  async create(userId: string, activity: BaseActivity): Promise<Activity> {
    const stored = await this.persistence.create(
      StoresDB.ACTIVITIES,
      ActivityPersistenceMapper.toCreateRecord(activity),
      userId,
    )
    return ActivityPersistenceMapper.fromRecord(stored)
  }

  async update(userId: string, activity: Activity): Promise<Activity> {
    const stored = await this.persistence.update(
      StoresDB.ACTIVITIES,
      ActivityPersistenceMapper.toRecord(activity),
      userId,
    )
    return ActivityPersistenceMapper.fromRecord(stored)
  }

  async delete(userId: string, id: ActivityID): Promise<void> {
    await this.persistence.remove(StoresDB.ACTIVITIES, userId, id)
  }
}
