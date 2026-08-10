import type { UUID } from 'crypto'
import type { Favorite, Schedule } from '#shared/domain'
import type {
  IBaseFavoriteSchedule,
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'

export interface ISchedulesRepository {
  findAll(userId: string): Promise<Schedule[]>
  findBy(userId: string, id: UUID): Promise<Schedule | undefined>
  getEntries(userId: string, ids: UUID[]): Promise<Schedule[]>
  getByKey(
    userId: string,
    scheduleSubjectKey: string,
  ): Promise<Schedule | undefined>
  create(
    userId: string,
    schedule: Schedule<IBaseScheduleGenerate>,
  ): Promise<Schedule<IScheduleGenerate>>
  createAll(
    userId: string,
    schedules: Schedule<IBaseScheduleGenerate>[],
  ): Promise<Schedule<IScheduleGenerate>[]>
  update(
    userId: string,
    schedule: Schedule<IScheduleGenerate>,
  ): Promise<Schedule<IScheduleGenerate>>
  deleteEntry(
    userId: string,
    id: UUID,
    expectedRevision?: number,
  ): Promise<void>
  deleteEntries(
    userId: string,
    ids: UUID[],
    expectedRevision?: number,
  ): Promise<void>
}
export interface ISchedulesFavoritesRepository {
  findAll(userId: string): Promise<Favorite[]>
  findById(userId: string, id: UUID): Promise<Favorite | undefined>
  create(
    userId: string,
    favorite: Favorite<IBaseFavoriteSchedule>,
  ): Promise<Favorite>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
}
