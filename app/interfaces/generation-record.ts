import type { Weekdays } from './event'
import type { IIntersectionOccurrence } from './ocurrences'
import type { IScheduleGenerate, UUID } from './schedule'

export type IGenerationMeta = Omit<IGenerationRecord, 'id' | 'scheduleIds' | 'resultCount' | 'occurrences'>

export type IGenerationResult = Omit<IGenerationRecord, 'scheduleIds'> & {
  schedules: IScheduleGenerate[]
}

export interface IGenerationRecord {
  id: UUID
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
  occurrences: IIntersectionOccurrence[]
}
