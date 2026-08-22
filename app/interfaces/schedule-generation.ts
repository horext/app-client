import type { UUID } from 'node:crypto'
import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './ocurrences'
import type { IGeneratedSchedule } from './schedule'

export interface IScheduleGenerationParameters {
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
}

export interface IScheduleGeneration {
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}

export interface IScheduleGenerationResult extends IScheduleGeneration {
  id: UUID
  schedules: IGeneratedSchedule[]
}
