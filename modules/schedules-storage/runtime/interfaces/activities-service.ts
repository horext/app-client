import type { IEvent } from '~/interfaces/event'

export interface IActivitiesService {
  getAll(): Promise<Array<IEvent & { id: string }>>
  save(activity: IEvent & { id: string }): Promise<void>
  saveAll(activities: Array<IEvent & { id: string }>): Promise<void>
  delete(id: string): Promise<void>
  update(activity: IEvent & { id: string }): Promise<void>
}
