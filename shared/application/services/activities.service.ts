import type { IActivity } from '#shared/domain/types/event'
import {
  Activity,
  type IActivityCreate,
  type IActivityUpdate,
} from '#shared/domain'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IActivitiesService } from '../interfaces/activities.service'

export class ActivitiesService implements IActivitiesService {
  constructor(private readonly repo: IActivitiesRepository) {}

  async getAll(userId: string): Promise<Array<IActivity>> {
    return (await this.repo.getAll(userId)).map((activity) =>
      activity.toSnapshot(),
    )
  }

  async get(
    userId: string,
    id: IActivity['id'],
  ): Promise<IActivity | undefined> {
    return (await this.repo.get(userId, id))?.toSnapshot()
  }

  async create(userId: string, activity: IActivityCreate): Promise<IActivity> {
    const entity = Activity.create(activity)
    return (await this.repo.create(userId, entity)).toSnapshot()
  }

  async delete(
    userId: string,
    id: IActivity['id'],
    expectedRevision?: number,
  ): Promise<void> {
    await this.repo.delete(userId, id, expectedRevision)
  }

  async updateById(
    userId: string,
    id: IActivity['id'],
    activity: IActivityUpdate,
  ): Promise<IActivity> {
    const existingActivity = await this.repo.get(userId, id)
    if (!existingActivity) {
      throw new Error(`Activity with id ${id} not found`)
    }
    const updated = existingActivity.update(activity)
    return (await this.repo.update(userId, updated)).toSnapshot()
  }
}
