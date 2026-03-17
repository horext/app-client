import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface ISchedulesRepository {
  getEntry(id: string): Promise<IScheduleGenerate | undefined>
  getEntries(ids: string[]): Promise<IScheduleGenerate[]>
  putEntry(schedule: IScheduleGenerate): Promise<void>
  putEntries(schedules: IScheduleGenerate[]): Promise<void>
  deleteEntry(id: string): Promise<void>
  deleteEntries(ids: string[]): Promise<void>
  getIds(list: 'generated' | 'favorites'): Promise<string[]>
  putIds(list: 'generated' | 'favorites', ids: string[]): Promise<void>
}
