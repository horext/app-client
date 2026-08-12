import type { UUID } from 'crypto'
import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: ISubject
}

export interface IBaseScheduleGenerate extends ReplicationState {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface IScheduleGenerate
  extends IBaseScheduleGenerate, IAuditable, ReplicatedIdentity {}

export interface IBaseFavoriteSchedule extends ReplicationState {
  id: IScheduleGenerate['id']
}

export interface IFavoriteSchedule
  extends IBaseFavoriteSchedule, IAuditable, ReplicatedIdentity {}

export type IScheduleCreate = IBaseScheduleGenerate
export type IScheduleUpdate = Partial<IScheduleCreate>

export interface IFavoriteCreate {
  scheduleId: UUID
}
