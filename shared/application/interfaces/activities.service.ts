import type { UUID } from 'crypto'
import type { IBaseActivity } from '#shared/domain/types/event'
import type { Activity, IActivityUpdate } from '#shared/domain'

export interface IActivitiesService {
  getAll(userId: string): Promise<Activity[]>
  get(userId: string, id: UUID): Promise<Activity | undefined>
  create(userId: string, activity: IBaseActivity): Promise<Activity>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
  patch(userId: string, id: UUID, activity: IActivityUpdate): Promise<Activity>
}
