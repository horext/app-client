import type { IEvent } from '~/interfaces/event'

export interface IActivitiesRepository {
  getAll(): Promise<Array<IEvent & { id: string }>>
  get(id: string): Promise<(IEvent & { id: string }) | undefined>
  put(activity: IEvent & { id: string }): Promise<void>
  putAll(activities: Array<IEvent & { id: string }>): Promise<void>
  delete(id: string): Promise<void>
}
