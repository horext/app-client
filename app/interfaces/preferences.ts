import type { Weekdays } from './event'

export interface IUserPreferences {
  id: 'preferences'
  weekDays: Weekdays[]
  crossings: number
}
