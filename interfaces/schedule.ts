import type { ISubjectSchedule } from './subject'
import Event from '~/model/Event'

export interface ISchedule {
  id: string
  scheduleSubjectIds: number[]
  schedule: ISubjectSchedule[]
  crossings: number
  events: Event[]
}
