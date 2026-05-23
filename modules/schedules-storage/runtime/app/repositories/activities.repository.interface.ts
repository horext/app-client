import type { IActivity, IBaseActivity } from '../../shared/interfaces/event'

export interface IActivitiesRepository {
  getAll(): Promise<Array<IActivity>>
  get(id: IActivity['id']): Promise<IActivity | undefined>
  create(activity: IBaseActivity): Promise<IActivity>
  update(activity: IActivity): Promise<IActivity>
  delete(id: IActivity['id']): Promise<void>
}
