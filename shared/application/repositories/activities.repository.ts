import type { UUID } from 'crypto'
import type { Activity } from '#shared/domain'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'

export interface IActivitiesRepository {
  getAll(userId: string): Promise<Activity[]>
  get(userId: string, id: UUID): Promise<Activity | undefined>
  create(
    userId: string,
    activity: Activity<IBaseActivity>,
  ): Promise<Activity<IActivity>>
  update(
    userId: string,
    activity: Activity<IActivity>,
  ): Promise<Activity<IActivity>>
  delete(userId: string, id: UUID): Promise<void>
}
