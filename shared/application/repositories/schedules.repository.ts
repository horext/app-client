import type { ScheduleFavorite, GeneratedSchedule } from '#shared/domain'
import type {
  IBaseScheduleFavorite,
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
  GeneratedScheduleId,
} from '#shared/domain/types/schedule'

export interface ISchedulesRepository {
  findAll(userId: string): Promise<GeneratedSchedule[]>
  findBy(
    userId: string,
    id: GeneratedScheduleId,
  ): Promise<GeneratedSchedule | undefined>
  getEntries(
    userId: string,
    ids: GeneratedScheduleId[],
  ): Promise<GeneratedSchedule[]>
  getByKey(
    userId: string,
    scheduleSubjectKey: string,
  ): Promise<GeneratedSchedule | undefined>
  create(
    userId: string,
    schedule: GeneratedSchedule<IBaseGeneratedSchedule>,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>>
  createAll(
    userId: string,
    schedules: GeneratedSchedule<IBaseGeneratedSchedule>[],
  ): Promise<GeneratedSchedule<IGeneratedSchedule>[]>
  update(
    userId: string,
    schedule: GeneratedSchedule<IGeneratedSchedule>,
  ): Promise<GeneratedSchedule<IGeneratedSchedule>>
  deleteEntry(
    userId: string,
    id: GeneratedScheduleId,
    expectedRevision?: number,
  ): Promise<void>
  deleteEntries(
    userId: string,
    ids: GeneratedScheduleId[],
    expectedRevision?: number,
  ): Promise<void>
}
export interface ISchedulesFavoritesRepository {
  findAll(userId: string): Promise<ScheduleFavorite[]>
  findById(
    userId: string,
    id: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined>
  findByScheduleId(
    userId: string,
    scheduleId: GeneratedScheduleId,
  ): Promise<ScheduleFavorite | undefined>
  create(
    userId: string,
    favorite: ScheduleFavorite<IBaseScheduleFavorite>,
  ): Promise<ScheduleFavorite>
  delete(
    userId: string,
    id: GeneratedScheduleId,
    expectedRevision?: number,
  ): Promise<void>
}
