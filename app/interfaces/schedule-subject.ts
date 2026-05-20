import type { IHourlyLoad } from './houly-load'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubject {
  id: number
  subject: Pick<ISubject, 'id'>
  hourlyLoad: Pick<IHourlyLoad, 'id'>
  schedule: ISubjectSchedule
}

export interface IScheduleSubjectSessionDetail extends IScheduleSubject {
  subject: ISubject
}
