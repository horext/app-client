import type { IUserPreferences } from '../../shared/interfaces/preferences'
import type { IPreferencesRepository } from './preferences-repository.interface'
import type { DbFactory } from '../context/db'
import { UserPreferences } from '../domain/UserPreferences'

const PREFERENCES_KEY: IUserPreferences['id'] = 'preferences'

export class IndexedDBPreferencesRepository implements IPreferencesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<UserPreferences | undefined> {
    const db = await this.getDb()
    const preferences = await db.get('preferences', PREFERENCES_KEY)
    return UserPreferences.from(preferences)
  }

  async save(preferences: UserPreferences): Promise<void> {
    const db = await this.getDb()
    await db.put('preferences', preferences.toData())
  }
}
