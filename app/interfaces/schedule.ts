import type { UUID } from 'crypto'
import type { ISubject, ISubjectSchedule } from './subject'
import type Event from '~/models/Event'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: Pick<ISubject, 'id' | 'course'>
}
export interface IScheduleGenerate {
  id: UUID
  scheduleSubjectKey: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: Event[]
}
