import type { Preferences } from '../../shared/domain'
import type {
  IBasePreferences,
  IPreferences,
} from '../../shared/interfaces/preferences'

export interface IPreferencesRepository {
  get(userId: string): Promise<Preferences<IPreferences> | undefined>
  create(
    userId: string,
    preferences: Preferences<IBasePreferences>,
  ): Promise<Preferences<IPreferences>>
  update(
    userId: string,
    preferences: Preferences<IPreferences>,
  ): Promise<Preferences<IPreferences>>
}
