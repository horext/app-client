import type { IActivity, IBaseActivity } from '../../shared/interfaces/event'
import type { IActivitiesRepository } from '../repositories/activities.repository.interface'
import type { IActivitiesService } from './activities-service.interface'

export class ActivitiesService implements IActivitiesService {
  constructor(private readonly repo: IActivitiesRepository) {}

  async getAll(): Promise<Array<IActivity>> {
    return this.repo.getAll()
  }

  async create(activity: IBaseActivity): Promise<IActivity> {
    return await this.repo.create(activity)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  async updateById(id: string, activity: IBaseActivity): Promise<IActivity> {
    const existingActivity = await this.repo.get(id)
    if (!existingActivity) {
      throw new Error(`Activity with id ${id} not found`)
    }
    return await this.repo.update({ ...existingActivity, ...activity })
  }
}
