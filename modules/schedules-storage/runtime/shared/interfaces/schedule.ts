import type { UUID } from 'crypto'
import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'
import type { IEntityMetadata } from './entity-metadata'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: ISubject
}

export interface IBaseScheduleGenerate {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface IScheduleGenerate
  extends IBaseScheduleGenerate, IEntityMetadata {
  id: UUID
}

export interface IBaseFavoriteSchedule {
  id: IScheduleGenerate['id']
}

export interface IFavoriteSchedule
  extends IBaseFavoriteSchedule, IEntityMetadata {}
