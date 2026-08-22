import type { BasePreferences, Preferences } from '#shared/domain'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { PreferencesPersistenceMapper } from '../mappers/persistence'

export class IndexedDBPreferencesRepository implements IPreferencesRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Preferences | undefined> {
    const [preferences] = await this.persistence.findAll(
      StoresDB.PREFERENCES,
      userId,
    )
    return preferences
      ? PreferencesPersistenceMapper.fromRecord(preferences)
      : undefined
  }

  async create(
    userId: string,
    preferences: BasePreferences,
  ): Promise<Preferences> {
    const stored = await this.persistence.create(
      StoresDB.PREFERENCES,
      PreferencesPersistenceMapper.toCreateRecord(preferences),
      userId,
    )
    return PreferencesPersistenceMapper.fromRecord(stored)
  }

  async update(userId: string, preferences: Preferences): Promise<Preferences> {
    const stored = await this.persistence.update(
      StoresDB.PREFERENCES,
      PreferencesPersistenceMapper.toRecord(preferences),
      userId,
    )
    return PreferencesPersistenceMapper.fromRecord(stored)
  }
}
