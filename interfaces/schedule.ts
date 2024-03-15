import type { IEvent } from './event'
import type { ISubjectSchedule } from './subject'

export interface IScheduleGenerate {
  id: string
  scheduleSubjectIds: number[]
  schedule: ISubjectSchedule[]
  crossings: number
  events: IEvent[]
}
