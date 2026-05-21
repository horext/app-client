import type { IUserPreferences } from '~/interfaces/preferences'

export interface IPreferencesService {
  getPreferences(): Promise<IUserPreferences | undefined>
  createPreferences(): Promise<IUserPreferences>
  patch(partial: Partial<Omit<IUserPreferences, 'id'>>): Promise<void>
}
