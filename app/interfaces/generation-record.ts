import type { Weekdays } from './event'
import type { UUID } from './schedule'

export interface IGenerationRecord {
  id: string
  generatedAt: string
  scheduleIds: UUID[]
  subjectIds: number[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number | null
  resultCount: number
}
