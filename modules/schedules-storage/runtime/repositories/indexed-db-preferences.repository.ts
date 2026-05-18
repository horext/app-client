import { toRaw } from 'vue'
import type { IUserPreferences } from '~/interfaces/preferences'
import type { IPreferencesRepository } from './preferences-repository.interface'
import type { DbFactory } from '../db'

const PREFERENCES_KEY: IUserPreferences['id'] = 'preferences'

export class IndexedDBPreferencesRepository implements IPreferencesRepository {
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<IUserPreferences | undefined> {
    const db = await this.getDb()
    return db.get('preferences', PREFERENCES_KEY)
  }

  async save(preferences: IUserPreferences): Promise<void> {
    const db = await this.getDb()
    await db.put('preferences', toRaw(preferences))
  }
}
