import type { UUID } from 'crypto'
import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'
import type { IAuditable } from './entity-metadata'
import type { ReplicatedIdentity } from './replicated-identity'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: ISubject
}

export interface IBaseScheduleGenerate {
  externalId?: UUID
  revision?: number
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface IScheduleGenerate
  extends IBaseScheduleGenerate, IAuditable, ReplicatedIdentity {}

export interface IBaseFavoriteSchedule {
  id: IScheduleGenerate['id']
  externalId?: UUID
  revision?: number
}

export interface IFavoriteSchedule
  extends IBaseFavoriteSchedule, IAuditable, ReplicatedIdentity {}

export type IScheduleCreate = IBaseScheduleGenerate
export type IScheduleUpdate = Partial<IScheduleCreate>

export interface IFavoriteCreate {
  scheduleId: UUID
}
export type IFavoriteUpdate = IFavoriteCreate
