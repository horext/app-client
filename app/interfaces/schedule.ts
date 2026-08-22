import type {
  IGeneratedScheduleSubject,
  GeneratedScheduleId,
} from '~~/shared/domain'

import type { IEvent } from './event'

export type {
  IGeneratedScheduleSubject,
  GeneratedScheduleId,
} from '~~/shared/domain'

export interface IBaseGeneratedSchedule {
  scheduleSubjectKey: string
  schedulesSubject: IGeneratedScheduleSubject[]
  crossings: number
  events: IEvent[]
}

export interface ILocalGeneratedSchedule extends IBaseGeneratedSchedule {
  events: IEvent[]
}

export interface IGeneratedSchedule extends IBaseGeneratedSchedule {
  id: GeneratedScheduleId
  events: IEvent[]
}

export type GeneratedScheduleInput = IBaseGeneratedSchedule | IGeneratedSchedule
