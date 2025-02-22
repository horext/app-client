import type { IScheduleGenerate } from '~/interfaces/schedule'

export type ScheduleCategory = 'GENARATED' | 'FAVORITE'

export interface IBaseSchedule extends IScheduleGenerate {
  categories: ScheduleCategory[]
}

export interface ISchedule extends IBaseSchedule {
  userId: string
  createdAt: Date
  updatedAt: Date
}
