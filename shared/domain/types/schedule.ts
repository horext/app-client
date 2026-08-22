import type { IEvent } from './event'
import type { ISubject, ISubjectSchedule } from './subject'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export interface IScheduleSubjectGenerate extends ISubjectSchedule {
  subject: ISubject
}

export type ScheduleGenerateId = BrandUUID<'ScheduleGenerateId'>

export interface IBaseScheduleGenerate extends ReplicationState<ScheduleGenerateId> {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

export interface IScheduleGenerate
  extends
    IBaseScheduleGenerate,
    IAuditable,
    ReplicatedIdentity<ScheduleGenerateId> {}

/** A schedule can be either a newly generated value or a persisted entity. */
export type ScheduleGenerateInput = IBaseScheduleGenerate | IScheduleGenerate

export interface IBaseFavoriteSchedule extends ReplicationState<ScheduleGenerateId> {
  id: ScheduleGenerateId
}

export interface IFavoriteSchedule
  extends
    IBaseFavoriteSchedule,
    IAuditable,
    ReplicatedIdentity<ScheduleGenerateId> {}

export type IScheduleCreate = IBaseScheduleGenerate
export type IScheduleUpdate = Partial<IScheduleCreate>

export interface IFavoriteCreate {
  scheduleId: ScheduleGenerateId
}
