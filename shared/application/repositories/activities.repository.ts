import type { UUID } from 'crypto'
import type { Activity } from '#shared/domain'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'

export interface IActivitiesRepository {
  findAll(userId: string): Promise<Activity[]>
  findById(userId: string, id: UUID): Promise<Activity | undefined>
  create(
    userId: string,
    activity: Activity<IBaseActivity>,
  ): Promise<Activity<IActivity>>
  update(
    userId: string,
    activity: Activity<IActivity>,
  ): Promise<Activity<IActivity>>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
}
