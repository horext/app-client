import type { UUID } from 'node:crypto'
import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './ocurrences'
import type { IScheduleGenerate } from './schedule'

export type IGenerationMeta = Omit<
  IGenerationRecord,
  'id' | 'scheduleIds' | 'resultCount' | 'occurrences'
>

export interface IGenerationRecord {
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IGenerationResult extends IGenerationRecord {
  id: UUID
  schedules: IScheduleGenerate[]
}
