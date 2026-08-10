import type { UUID } from 'crypto'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'
import type { IActivityUpdate } from '#shared/domain'

export interface IActivitiesService {
  getAll(userId: string): Promise<Array<IActivity>>
  get(userId: string, id: UUID): Promise<IActivity | undefined>
  create(userId: string, activity: IBaseActivity): Promise<IActivity>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
  updateById(
    userId: string,
    id: UUID,
    activity: IActivityUpdate,
  ): Promise<IActivity>
}
