import type { Activity, BaseActivity } from '#shared/domain'
import type { ActivityID } from '#shared/domain/types/event'

export interface IActivitiesRepository {
  findAll(userId: string): Promise<Activity[]>
  findById(userId: string, id: ActivityID): Promise<Activity | undefined>
  create(userId: string, activity: BaseActivity): Promise<Activity>
  update(userId: string, activity: Activity): Promise<Activity>
  delete(
    userId: string,
    id: ActivityID,
    expectedRevision?: number,
  ): Promise<void>
}
