import type {
  IBaseScheduleGenerate,
  IFavoriteSchedule,
  IScheduleGenerate,
} from '../../shared/interfaces/schedule'

export interface ISchedulesRepository {
  getEntries(ids: IScheduleGenerate['id'][]): Promise<IScheduleGenerate[]>
  getByKey(scheduleSubjectKey: string): Promise<IScheduleGenerate | undefined>
  create(schedule: IBaseScheduleGenerate): Promise<IScheduleGenerate>
  update(schedule: IScheduleGenerate): Promise<IScheduleGenerate>
  saveAll(schedules: IBaseScheduleGenerate[]): Promise<IScheduleGenerate[]>
  deleteEntry(id: IScheduleGenerate['id']): Promise<void>
  deleteEntries(ids: IScheduleGenerate['id'][]): Promise<void>
}
export interface ISchedulesFavoritesRepository {
  getIds(): Promise<IScheduleGenerate['id'][]>
  findById(id: IScheduleGenerate['id']): Promise<IFavoriteSchedule | undefined>
  create(id: IScheduleGenerate['id']): Promise<IFavoriteSchedule>
  deleteById(id: IScheduleGenerate['id']): Promise<void>
  setList(ids: IScheduleGenerate['id'][]): Promise<void>
}
