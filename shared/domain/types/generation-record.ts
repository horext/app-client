import type { UUID } from 'crypto'
import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './occurrences'
import type { IScheduleGenerate } from './schedule'
import type { IAuditable } from './entity-metadata'
import type { ReplicatedIdentity } from './replicated-identity'

export type IGenerationMeta = Omit<
  IGenerationRecord,
  'id' | 'scheduleIds' | 'resultCount' | 'occurrences' | keyof IAuditable
>

export interface IBaseGenerationRecord {
  externalId?: UUID
  expectedRevision?: number
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IGenerationRecord
  extends IBaseGenerationRecord, IAuditable, ReplicatedIdentity {}

export interface IGenerationResult extends IGenerationRecord {
  schedules: IScheduleGenerate[]
  occurrences: IIntersectionOccurrence[]
}

export type IGenerationCreate = IBaseGenerationRecord
export type IGenerationUpdate = Partial<IBaseGenerationRecord>
