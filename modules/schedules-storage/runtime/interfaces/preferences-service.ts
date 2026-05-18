import type { IUserPreferences } from '~/interfaces/preferences'
import type { Weekdays } from '~/interfaces/event'

export interface IPreferencesService {
  getPreferences(): Promise<IUserPreferences | undefined>
  createPreferences(): Promise<IUserPreferences>
  patch(partial: Partial<Omit<IUserPreferences, 'id'>>): Promise<void>
  updateWeekDays(weekDays: Weekdays[]): Promise<void>
  updateCrossings(crossings: number): Promise<void>
  updateMaxGenerationHistory(n: number): Promise<void>
}
