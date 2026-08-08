import type { UUID } from 'crypto'
import type { Activity } from '../../shared/domain'

export interface IActivitiesRepository {
  getAll(userId: string): Promise<Activity[]>
  get(userId: string, id: UUID): Promise<Activity | undefined>
  create(userId: string, activity: Activity): Promise<Activity>
  update(userId: string, activity: Activity): Promise<Activity>
  delete(userId: string, id: UUID): Promise<void>
}
