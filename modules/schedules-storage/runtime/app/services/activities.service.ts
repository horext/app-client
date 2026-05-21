import type { IBaseEvent, IEvent } from '../../shared/interfaces/event'
import type { IActivitiesRepository } from '../repositories/activities.repository.interface'
import type { IActivitiesService } from './activities-service.interface'

export class ActivitiesService implements IActivitiesService {
  constructor(private readonly repo: IActivitiesRepository) {}

  async getAll(): Promise<Array<IEvent>> {
    return this.repo.getAll()
  }

  async create(activity: IBaseEvent): Promise<IEvent> {
    return await this.repo.create(activity)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  async update(activity: IEvent): Promise<IEvent> {
    return await this.repo.update(activity)
  }
}
