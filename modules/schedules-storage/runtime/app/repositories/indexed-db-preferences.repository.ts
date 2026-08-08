import type { IPreferences } from '../../shared/interfaces/preferences'
import { Preferences } from '../../shared/domain'
import type { IPreferencesRepository } from './preferences-repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

const PREFERENCES_KEY: IPreferences['id'] = 'preferences'

export class IndexedDBPreferencesRepository implements IPreferencesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Preferences | undefined> {
    const preferences = await this.persistence.find(
      StoresDB.PREFERENCES,
      userId,
      PREFERENCES_KEY,
    )
    return preferences ? Preferences.restore(preferences) : undefined
  }

  async create(userId: string, preferences: Preferences): Promise<Preferences> {
    const stored = await this.persistence.create(
      StoresDB.PREFERENCES,
      preferences.toSnapshot(),
      userId,
    )
    return Preferences.restore(stored)
  }

  async update(userId: string, preferences: Preferences): Promise<Preferences> {
    const stored = await this.persistence.update(
      StoresDB.PREFERENCES,
      preferences.toSnapshot(),
      userId,
    )
    return Preferences.restore(stored)
  }
}
