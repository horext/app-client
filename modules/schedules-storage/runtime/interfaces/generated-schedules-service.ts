import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface IGeneratedSchedulesService {
  getGeneratedSchedules(): Promise<IScheduleGenerate[]>
  saveGeneratedSchedules(schedules: IScheduleGenerate[]): Promise<void>
  addGeneratedSchedule(schedule: IScheduleGenerate): Promise<void>
  removeGeneratedSchedule(id: string): Promise<void>
}
