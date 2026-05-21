import type { IUserPreferences } from '../../shared/interfaces/preferences'
import type { UserPreferences } from '../domain/UserPreferences'

export interface IPreferencesRepository {
  get(): Promise<UserPreferences | undefined>
  save(preferences: IUserPreferences): Promise<void>
}
