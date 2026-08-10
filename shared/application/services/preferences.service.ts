import type {
  IBasePreferences,
  IPreferences,
} from '#shared/domain/types/preferences'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IPreferencesService } from '../interfaces/preferences.service'
import { Preferences } from '#shared/domain'

export class PreferencesService implements IPreferencesService {
  constructor(private readonly repo: IPreferencesRepository) {}

  private async _load(
    userId: string,
  ): Promise<Preferences<IPreferences> | undefined> {
    return await this.repo.get(userId)
  }

  private async _create(
    userId: string,
    prefs: Preferences<IBasePreferences>,
  ): Promise<Preferences<IPreferences>> {
    return this.repo.create(userId, prefs)
  }

  private async _update(
    userId: string,
    prefs: Preferences<IPreferences>,
  ): Promise<Preferences<IPreferences>> {
    return this.repo.update(userId, prefs)
  }

  async getPreferences(userId: string): Promise<IPreferences | undefined> {
    return (await this._load(userId))?.toSnapshot()
  }

  async createPreferences(userId: string): Promise<IPreferences> {
    const existing = await this._load(userId)
    if (existing) return existing.toSnapshot()
    const prefs = Preferences.create({
      weekDays: [1, 2, 3, 4, 5, 6],
      crossings: 0,
      maxGenerationHistory: 10,
    })
    return (await this._create(userId, prefs)).toSnapshot()
  }

  async patch(
    userId: string,
    partial: Partial<IBasePreferences>,
  ): Promise<void> {
    const prefs = await this._load(userId)
    if (!prefs) return
    await this._update(userId, prefs.update(partial))
  }
}
