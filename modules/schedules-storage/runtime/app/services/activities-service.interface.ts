import type { IBaseEvent, IEvent } from '../../shared/interfaces/event'

export interface IActivitiesService {
  getAll(): Promise<Array<IEvent>>
  create(activity: IBaseEvent): Promise<IEvent>
  delete(id: string): Promise<void>
  update(activity: IEvent): Promise<IEvent>
}
