import type { IUserPreferences } from '../../shared/interfaces/preferences'

export interface IPreferencesRepository {
  get(): Promise<IUserPreferences | undefined>
  save(preferences: IUserPreferences): Promise<void>
}
