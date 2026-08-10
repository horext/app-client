import type {
  IBasePreferences,
  IPreferences,
} from '#shared/domain/types/preferences'
import { Preferences } from '#shared/domain'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBPreferencesRepository implements IPreferencesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Preferences<IPreferences> | undefined> {
    const [preferences] = await this.persistence.findAll(
      StoresDB.PREFERENCES,
      userId,
    )
    return preferences ? Preferences.restore(preferences) : undefined
  }

  async create(
    userId: string,
    preferences: Preferences<IBasePreferences>,
  ): Promise<Preferences<IPreferences>> {
    const stored = await this.persistence.create(
      StoresDB.PREFERENCES,
      preferences.toSnapshot(),
      userId,
    )
    return Preferences.restore(stored)
  }

  async update(
    userId: string,
    preferences: Preferences<IPreferences>,
  ): Promise<Preferences<IPreferences>> {
    const stored = await this.persistence.update(
      StoresDB.PREFERENCES,
      preferences.toSnapshot(),
      userId,
    )
    return Preferences.restore(stored)
  }
}
