import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: Pick<ISubject, 'id' | 'course'>
}
export type UUID = `${string}-${string}-${string}-${string}-${string}`
export interface IScheduleGenerate {
  id: UUID;
  scheduleSubjectKey: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}
