import type { Preferences } from '../../shared/domain'

export interface IPreferencesRepository {
  get(userId: string): Promise<Preferences | undefined>
  create(userId: string, preferences: Preferences): Promise<Preferences>
  update(userId: string, preferences: Preferences): Promise<Preferences>
}
