import type { IScheduleGenerate } from '../../shared/interfaces/schedule'

export interface ISchedulesRepository {
  getEntries(ids: IScheduleGenerate['id'][]): Promise<IScheduleGenerate[]>
  putEntry(schedule: IScheduleGenerate): Promise<void>
  putEntries(schedules: IScheduleGenerate[]): Promise<void>
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
