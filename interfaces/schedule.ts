import type { ISubjectSchedule } from './subject'
import Event from '~/model/Event'

export interface IScheduleGenerate {
  id: string
  scheduleSubjectIds: number[]
  schedule: ISubjectSchedule[]
  crossings: number
  events: Event[]
}
