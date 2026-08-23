import type { IPreferencesUpdate } from '#shared/domain/types/preferences'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IPreferencesService } from '../interfaces/preferences.service'
import { Preferences, type BasePreferences } from '#shared/domain'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists.error'

export class PreferencesService implements IPreferencesService {
  constructor(private readonly repo: IPreferencesRepository) {}

  private async _load(userId: string): Promise<Preferences | undefined> {
    return await this.repo.get(userId)
  }

  private async _create(
    userId: string,
    prefs: BasePreferences,
  ): Promise<Preferences> {
    return this.repo.create(userId, prefs)
  }

  private async _update(
    userId: string,
    prefs: Preferences,
  ): Promise<Preferences> {
    return this.repo.update(userId, prefs)
  }

  async get(userId: string): Promise<Preferences | undefined> {
    return this._load(userId)
  }

  async create(
    userId: string,
    initial: IPreferencesUpdate = {},
  ): Promise<Preferences> {
    if (await this._load(userId))
      throw new ResourceAlreadyExistsError('preferences')
    const prefs = Preferences.create({
      weekDays: initial.weekDays ?? [1, 2, 3, 4, 5, 6],
      crossings: initial.crossings ?? 0,
      maxGenerationHistory: initial.maxGenerationHistory ?? 10,
    })
    return this._create(userId, prefs)
  }

  async patch(userId: string, value: IPreferencesUpdate): Promise<Preferences> {
    const existing = await this._load(userId)
    if (!existing) throw new ResourceNotFoundError('preferences')
    existing.update(value)
    return this._update(userId, existing)
  }
}
