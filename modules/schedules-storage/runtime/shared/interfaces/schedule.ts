import type { UUID } from 'crypto'
import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: ISubject
}

export interface IBaseScheduleGenerate {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface IScheduleGenerate extends IBaseScheduleGenerate {
  id: UUID
}
