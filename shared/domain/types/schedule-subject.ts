import type { IHourlyLoad } from './hourly-load'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubject {
  id: number
  subject: Pick<ISubject, 'id'>
  hourlyLoad: Pick<IHourlyLoad, 'id'>
  schedule: Pick<ISubjectSchedule, 'id' | 'section' | 'sessions'>
}

export interface IScheduleSubjectDetail extends Omit<
  IScheduleSubject,
  'subject'
> {
  subject: ISubject
}

export type IScheduleSubjectSessionDetail = IScheduleSubjectDetail
