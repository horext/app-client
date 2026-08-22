import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './occurrences'
import type { IGeneratedSchedule, GeneratedScheduleId } from './schedule'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export type IGenerationMeta = Omit<
  IGenerationRecord,
  'id' | 'scheduleIds' | 'resultCount' | 'occurrences' | keyof IAuditable
>

export type GenerationId = BrandUUID<'GenerationId'>
export interface IBaseGenerationRecord<
  T extends GenerationId = GenerationId,
> extends ReplicationState<T> {
  generatedAt: string
  scheduleIds: GeneratedScheduleId[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IGenerationRecord
  extends IBaseGenerationRecord, IAuditable, ReplicatedIdentity<GenerationId> {}

export interface IGenerationResult extends IGenerationRecord {
  schedules: IGeneratedSchedule[]
  occurrences: IIntersectionOccurrence[]
}

export type IGenerationCreate = IBaseGenerationRecord
export type IGenerationUpdate = Partial<IBaseGenerationRecord>
