import type { ISubject, ISubjectSchedule } from './subject'
import type { IEvent } from './event'
import type { UUID } from 'crypto'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: Pick<ISubject, 'id' | 'course'>
}
export interface IBaseScheduleGenerate {
  scheduleSubjectKey: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface ILocalScheduleGenerate extends IBaseScheduleGenerate {
  events: IEvent[]
}

export interface IScheduleGenerate extends IBaseScheduleGenerate {
  id: UUID
  events: IEvent[]
}
