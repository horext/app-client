import type { Activity } from '#shared/domain'
import type {
  ActivityID,
  IActivity,
  IBaseActivity,
} from '#shared/domain/types/event'

export interface IActivitiesRepository {
  findAll(userId: string): Promise<Activity[]>
  findById(userId: string, id: ActivityID): Promise<Activity | undefined>
  create(
    userId: string,
    activity: Activity<IBaseActivity>,
  ): Promise<Activity<IActivity>>
  update(
    userId: string,
    activity: Activity<IActivity>,
  ): Promise<Activity<IActivity>>
  delete(
    userId: string,
    id: ActivityID,
    expectedRevision?: number,
  ): Promise<void>
}
