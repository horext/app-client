import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'

export interface ISubjectScheduleGenerate  extends ISubjectSchedule{
  subject: Pick<ISubject, 'id' | 'course'>
}

export interface IScheduleGenerate {
  id: string
  scheduleSubjectIds: number[]
  schedule: ISubjectScheduleGenerate[]
  crossings: number
  events: IEvent[]
}
