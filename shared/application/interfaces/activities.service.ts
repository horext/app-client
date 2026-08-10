import type { UUID } from 'crypto'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'

export interface IActivitiesService {
  getAll(userId: string): Promise<Array<IActivity>>
  get(userId: string, id: UUID): Promise<IActivity | undefined>
  create(userId: string, activity: IBaseActivity): Promise<IActivity>
  delete(userId: string, id: UUID): Promise<void>
  updateById(
    userId: string,
    id: UUID,
    activity: IBaseActivity,
  ): Promise<IActivity>
}
