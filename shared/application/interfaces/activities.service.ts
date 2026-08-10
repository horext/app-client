import type { UUID } from 'crypto'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'
import type { Activity, IActivityUpdate } from '#shared/domain'

export interface IActivitiesService {
  getAll(userId: string): Promise<Array<Activity<IActivity>>>
  get(userId: string, id: UUID): Promise<Activity<IActivity> | undefined>
  create(userId: string, activity: IBaseActivity): Promise<Activity<IActivity>>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
  patch(
    userId: string,
    id: UUID,
    activity: IActivityUpdate,
  ): Promise<Activity<IActivity>>
}
