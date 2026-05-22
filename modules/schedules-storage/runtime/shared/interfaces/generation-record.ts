import type { UUID } from 'crypto'
import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './ocurrences'
import type { IScheduleGenerate } from './schedule'

export type IGenerationMeta = Omit<
  IGenerationRecord,
  'id' | 'scheduleIds' | 'resultCount' | 'occurrences'
>

export interface IBaseGenerationRecord {
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IGenerationRecord extends IBaseGenerationRecord {
  id: UUID
}

export interface IGenerationResult  extends IGenerationRecord {
  schedules: IScheduleGenerate[]
  occurrences: IIntersectionOccurrence[]
}
