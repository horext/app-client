import type { IEvent } from '~/interfaces/event'
import type { IActivitiesRepository } from '../interfaces/activities-repository'
import type { IActivitiesService } from '../interfaces/activities-service'

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
