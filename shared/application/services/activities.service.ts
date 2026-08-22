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

  getAll(userId: string): Promise<Activity[]> {
    return this.repo.findAll(userId)
  }

  async get(
    userId: string,
    id: Parameters<IActivitiesRepository['findById']>[1],
  ): Promise<Activity | undefined> {
    return this.repo.findById(userId, id)
  }

  create(userId: string, activity: IActivityCreate) {
    return this.repo.create(userId, Activity.create(activity))
  }

  async delete(
    userId: string,
    id: Parameters<IActivitiesRepository['delete']>[1],
    expectedRevision?: number,
  ): Promise<void> {
    await this.repo.delete(userId, id, expectedRevision)
  }

  async patch(
    userId: string,
    id: Parameters<IActivitiesRepository['findById']>[1],
    activity: IActivityUpdate,
  ): Promise<Activity> {
    const existingActivity = await this.repo.findById(userId, id)
    if (!existingActivity) {
      throw new ResourceNotFoundError('activity')
    }
    existingActivity.update(activity)
    return this.repo.update(userId, existingActivity)
  }
}
