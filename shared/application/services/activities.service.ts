import type { IActivity } from '#shared/domain/types/event'
import {
  Activity,
  type IActivityCreate,
  type IActivityUpdate,
} from '#shared/domain'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IActivitiesService } from '../interfaces/activities.service'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class ActivitiesService implements IActivitiesService {
  constructor(private readonly repo: IActivitiesRepository) {}

  getAll(userId: string): Promise<Array<Activity<IActivity>>> {
    return this.repo.findAll(userId)
  }

  async get(
    userId: string,
    id: IActivity['id'],
  ): Promise<Activity<IActivity> | undefined> {
    return this.repo.findById(userId, id)
  }

  create(userId: string, activity: IActivityCreate) {
    return this.repo.create(userId, Activity.create(activity))
  }

  async delete(
    userId: string,
    id: IActivity['id'],
    expectedRevision?: number,
  ): Promise<void> {
    await this.repo.delete(userId, id, expectedRevision)
  }

  async patch(
    userId: string,
    id: IActivity['id'],
    activity: IActivityUpdate,
  ): Promise<Activity<IActivity>> {
    const existingActivity = await this.repo.findById(userId, id)
    if (!existingActivity) {
      throw new ResourceNotFoundError('activity')
    }
    const updated = existingActivity.update(activity)
    return this.repo.update(userId, updated)
  }
}
