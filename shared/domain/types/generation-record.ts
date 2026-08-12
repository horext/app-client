import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './occurrences'
import type { IScheduleGenerate, ScheduleGenerateId } from './schedule'
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

export interface IBaseGenerationRecord extends ReplicationState {
  generatedAt: string
  scheduleIds: ScheduleGenerateId[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export type GenerationId = BrandUUID<'GenerationId'>

export interface IGenerationRecord
  extends IBaseGenerationRecord, IAuditable, ReplicatedIdentity<GenerationId> {}

export interface IGenerationResult extends IGenerationRecord {
  schedules: IScheduleGenerate[]
  occurrences: IIntersectionOccurrence[]
}

export type IGenerationCreate = IBaseGenerationRecord
export type IGenerationUpdate = Partial<IBaseGenerationRecord>
