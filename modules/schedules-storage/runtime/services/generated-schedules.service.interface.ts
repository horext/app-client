import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface IGeneratedSchedulesService {
  getGeneratedSchedules(): Promise<IScheduleGenerate[]>
  addGeneratedSchedule(schedule: IScheduleGenerate): Promise<void>
  removeGeneratedSchedule(id: string): Promise<void>
}
