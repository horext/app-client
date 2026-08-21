import type { IHourlyLoadReference } from './hourly-load'
import type { ISubject, ISubjectSchedule } from './subject'

export type IScheduleSubjectReference = Pick<IScheduleSubject, 'id'>
export type ISubjectReference = Pick<ISubject, 'id'>
export type IScheduleSubjectSchedule = Pick<
  ISubjectSchedule,
  'id' | 'section' | 'sessions'
>

export interface IScheduleSubject {
  id: number
  subject: ISubjectReference
  hourlyLoad: IHourlyLoadReference
  schedule: IScheduleSubjectSchedule
}

export interface IScheduleSubjectDetail extends Omit<
  IScheduleSubject,
  'subject'
> {
  subject: ISubject
}

export type IScheduleSubjectSessionDetail = IScheduleSubjectDetail
