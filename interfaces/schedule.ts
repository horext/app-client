import type { IEvent } from './event'
import type { IIntersectionOccurrence } from './ocurrences'
import type { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: Pick<ISubject, 'id' | 'course' | 'credits'>
}

export interface IScheduleGenerate {
  id: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
  intersections: {
    occurrences: IIntersectionOccurrence[]
    typeStats: {
      count: number
      type: string
    }[]
    categoryStats: {
      count: number
      category: string
    }[]
  }
  totalCredits: number
}
