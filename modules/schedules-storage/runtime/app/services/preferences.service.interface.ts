import type { IUserPreferences } from '../../shared/interfaces/preferences'

export interface IPreferencesService {
  getPreferences(): Promise<IUserPreferences | undefined>
  createPreferences(): Promise<IUserPreferences>
  patch(partial: Partial<Omit<IUserPreferences, 'id'>>): Promise<void>
}
