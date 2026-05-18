import type { IEvent } from '~/interfaces/event'
import type { IActivitiesRepository } from '../repositories/activities.repository.interface'
import type { IActivitiesService } from './activities-service.interface'

export class ActivitiesService implements IActivitiesService {
  constructor(private readonly repo: IActivitiesRepository) {}

  async getAll(): Promise<Array<IEvent & { id: string }>> {
    return this.repo.getAll()
  }

  async save(activity: IEvent & { id: string }): Promise<void> {
    await this.repo.put(activity)
  }

  async saveAll(activities: Array<IEvent & { id: string }>): Promise<void> {
    await this.repo.putAll(activities)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  async update(activity: IEvent & { id: string }): Promise<void> {
    await this.repo.put(activity)
  }
}
