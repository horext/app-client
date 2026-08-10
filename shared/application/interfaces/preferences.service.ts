import type {
  IBasePreferences,
  IPreferences,
} from '#shared/domain/types/preferences'

export interface IPreferencesService {
  getPreferences(userId: string): Promise<IPreferences | undefined>
  createPreferences(userId: string): Promise<IPreferences>
  patch(userId: string, partial: Partial<IBasePreferences>): Promise<void>
}
