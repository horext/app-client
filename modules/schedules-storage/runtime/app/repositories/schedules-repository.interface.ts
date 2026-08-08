import type { UUID } from 'crypto'
import type { Favorite, Schedule } from '../../shared/domain'

export interface ISchedulesRepository {
  findAll(userId: string): Promise<Schedule[]>
  getEntries(userId: string, ids: UUID[]): Promise<Schedule[]>
  getByKey(
    userId: string,
    scheduleSubjectKey: string,
  ): Promise<Schedule | undefined>
  create(userId: string, schedule: Schedule): Promise<Schedule>
  createAll(userId: string, schedules: Schedule[]): Promise<Schedule[]>
  update(userId: string, schedule: Schedule): Promise<Schedule>
  deleteEntry(userId: string, id: UUID): Promise<void>
  deleteEntries(userId: string, ids: UUID[]): Promise<void>
}
export interface ISchedulesFavoritesRepository {
  findAll(userId: string): Promise<Favorite[]>
  findById(userId: string, id: UUID): Promise<Favorite | undefined>
  create(userId: string, favorite: Favorite): Promise<Favorite>
  delete(userId: string, id: UUID): Promise<void>
}
