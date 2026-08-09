import type { Weekdays } from './event'
import type { UUID } from 'crypto'

export interface IUserPreferences {
  id: UUID
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}
