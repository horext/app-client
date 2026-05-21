import type { IBaseEvent, IEvent } from '../../shared/interfaces/event'

export interface IActivitiesRepository {
  getAll(): Promise<Array<IEvent>>
  get(id: string): Promise<IEvent | undefined>
  create(activity: IBaseEvent): Promise<IEvent>
  update(activity: IEvent): Promise<IEvent>
  delete(id: string): Promise<void>
}
