import type { IUserPreferences } from '~/interfaces/preferences'
import type { Weekdays } from '~/interfaces/event'
import type { IPreferencesRepository } from '../interfaces/preferences-repository'
import type { IPreferencesService } from '../interfaces/preferences-service'

const DEFAULT_PREFERENCES: IUserPreferences = {
  id: 'preferences',
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  crossings: 0,
}

export class PreferencesService implements IPreferencesService {
  constructor(private readonly repo: IPreferencesRepository) {}

  async getPreferences(): Promise<IUserPreferences | undefined> {
    return this.repo.get()
  }

  async createPreferences(): Promise<IUserPreferences> {
    const existing = await this.repo.get()
    if (existing) return existing
    const defaultPrefs = { ...DEFAULT_PREFERENCES }
    await this.repo.save(defaultPrefs)
    return defaultPrefs
  }

  async patch(partial: Partial<Omit<IUserPreferences, 'id'>>): Promise<void> {
    const current = await this.repo.get()
    if (!current) return
    await this.repo.save({ ...current, ...partial })
  }

  async updateWeekDays(weekDays: Weekdays[]): Promise<void> {
    await this.patch({ weekDays })
  }

  async updateCrossings(crossings: number): Promise<void> {
    await this.patch({ crossings })
  }
}
