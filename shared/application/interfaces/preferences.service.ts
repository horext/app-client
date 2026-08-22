import type {
  IPreferences,
  IPreferencesUpdate,
} from '#shared/domain/types/preferences'
import type { Preferences } from '#shared/domain'

export interface IPreferencesService {
  get(userId: string): Promise<Preferences<IPreferences> | undefined>
  create(
    userId: string,
    initial?: IPreferencesUpdate,
  ): Promise<Preferences<IPreferences>>
  patch(
    userId: string,
    value: IPreferencesUpdate,
  ): Promise<Preferences<IPreferences>>
}
