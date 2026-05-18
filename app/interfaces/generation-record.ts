import type { Weekdays } from './event'
import type { UUID } from './schedule'

export type IGenerationMeta = Omit<IGenerationRecord, 'id' | 'scheduleIds' | 'resultCount'>

export interface IGenerationRecord {
  id: string
  generatedAt: string
  scheduleIds: UUID[]
  crossingsSetting: number
  weekDays: Weekdays[]
  hourlyLoadId: number
  resultCount: number
}
