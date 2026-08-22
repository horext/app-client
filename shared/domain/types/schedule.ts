import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export interface IGeneratedScheduleSubject extends ISubjectSchedule {
  subject: ISubject
}

export type GeneratedScheduleId = BrandUUID<'GeneratedScheduleId'>

export interface IBaseGeneratedSchedule extends ReplicationState<GeneratedScheduleId> {
  scheduleSubjectKey: string
  schedulesSubject: IGeneratedScheduleSubject[]
  crossings: number
  events: IEvent[]
}

export interface IGeneratedSchedule
  extends
    IBaseGeneratedSchedule,
    IAuditable,
    ReplicatedIdentity<GeneratedScheduleId> {}

/** A schedule can be either a newly generated value or a persisted entity. */
export type GeneratedScheduleInput = IBaseGeneratedSchedule | IGeneratedSchedule

export interface IBaseScheduleFavorite extends ReplicationState<GeneratedScheduleId> {
  id: GeneratedScheduleId
}

export interface IScheduleFavorite
  extends
    IBaseScheduleFavorite,
    IAuditable,
    ReplicatedIdentity<GeneratedScheduleId> {}

export type IGeneratedScheduleCreate = IBaseGeneratedSchedule
export type IGeneratedScheduleUpdate = Partial<IGeneratedScheduleCreate>

export interface IScheduleFavoriteCreate {
  scheduleId: GeneratedScheduleId
}
