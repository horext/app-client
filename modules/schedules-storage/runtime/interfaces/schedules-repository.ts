import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface ISchedulesRepository {
  getEntry(id: IScheduleGenerate['id']): Promise<IScheduleGenerate | undefined>
  getEntries(ids: IScheduleGenerate['id'][]): Promise<IScheduleGenerate[]>
  putEntry(schedule: IScheduleGenerate): Promise<void>
  putEntries(schedules: IScheduleGenerate[]): Promise<void>
  deleteEntry(id: IScheduleGenerate['id']): Promise<void>
  deleteEntries(ids: IScheduleGenerate['id'][]): Promise<void>
  getIds(list: 'favorites'): Promise<IScheduleGenerate['id'][]>
  isInList(list: 'favorites', id: IScheduleGenerate['id']): Promise<boolean>
  addToList(list: 'favorites', id: IScheduleGenerate['id']): Promise<void>
  removeFromList(list: 'favorites', id: IScheduleGenerate['id']): Promise<void>
  setList(list: 'favorites', ids: IScheduleGenerate['id'][]): Promise<void>
}
