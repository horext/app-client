import type {
  IBasePreferences,
  IPreferences,
} from '#shared/domain/types/preferences'

export interface IPreferencesService {
  get(userId: string): Promise<IPreferences | undefined>
  create(
    userId: string,
    initial?: Partial<IBasePreferences>,
  ): Promise<IPreferences>
  patch(userId: string, value: Partial<IBasePreferences>): Promise<IPreferences>
}
