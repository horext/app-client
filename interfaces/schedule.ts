import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubjectGenerate  extends ISubjectSchedule{
  subject: Pick<ISubject, 'id' | 'course'>
}

export interface IScheduleGenerate {
  id: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}
