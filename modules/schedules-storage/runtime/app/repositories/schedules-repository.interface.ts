import type {
  IBaseScheduleGenerate,
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
  isInList(id: IScheduleGenerate['id']): Promise<boolean>
  addToList(id: IScheduleGenerate['id']): Promise<void>
  removeFromList(id: IScheduleGenerate['id']): Promise<void>
  setList(ids: IScheduleGenerate['id'][]): Promise<void>
}
