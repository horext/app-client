import type {
  IScheduleSubjectGenerate,
  ScheduleGenerateId,
} from '~~/shared/domain'

import type { IEvent } from './event'

export type {
  IScheduleSubjectGenerate,
  ScheduleGenerateId,
} from '~~/shared/domain'

export interface IBaseScheduleGenerate {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface ILocalScheduleGenerate extends IBaseScheduleGenerate {
  events: IEvent[]
}

export interface IScheduleGenerate extends IBaseScheduleGenerate {
  id: ScheduleGenerateId
  events: IEvent[]
}

export type ScheduleGenerateInput = IBaseScheduleGenerate | IScheduleGenerate
