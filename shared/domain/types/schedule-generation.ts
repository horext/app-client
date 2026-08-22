import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './occurrences'
import type { IGeneratedSchedule, GeneratedScheduleId } from './schedule'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export interface IScheduleGenerationParameters {
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
}

export type ScheduleGenerationId = BrandUUID<'ScheduleGenerationId'>
export interface IBaseScheduleGeneration<
  T extends ScheduleGenerationId = ScheduleGenerationId,
>
  extends ReplicationState<T>, IScheduleGenerationParameters {
  generatedAt: string
  scheduleIds: GeneratedScheduleId[]
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IScheduleGeneration
  extends
    IBaseScheduleGeneration,
    IAuditable,
    ReplicatedIdentity<ScheduleGenerationId> {}

export interface IScheduleGenerationResult extends IScheduleGeneration {
  schedules: IGeneratedSchedule[]
  occurrences: IIntersectionOccurrence[]
}

export type IScheduleGenerationCreate = IBaseScheduleGeneration
export type IScheduleGenerationUpdate = Partial<IBaseScheduleGeneration>
