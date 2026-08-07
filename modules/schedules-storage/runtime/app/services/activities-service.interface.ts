import type { UUID } from 'crypto'
import type { IActivity, IBaseActivity } from '../../shared/interfaces/event'

export interface IActivitiesService {
  getAll(): Promise<Array<IActivity>>
  create(activity: IBaseActivity): Promise<IActivity>
  delete(id: UUID): Promise<void>
  updateById(id: UUID, activity: IBaseActivity): Promise<IActivity>
}
