import type {
  IBasePreferences,
  IPreferences,
} from '../../shared/interfaces/preferences'
import type { IPreferencesRepository } from '../repositories/preferences-repository.interface'
import type { IPreferencesService } from './preferences.service.interface'
import { Preferences } from '../../shared/domain'

export class PreferencesService implements IPreferencesService {
  constructor(private readonly repo: IPreferencesRepository) {}

  private async _load(userId: string): Promise<Preferences | undefined> {
    return await this.repo.get(userId)
  }

  private async _create(
    userId: string,
    prefs: Preferences,
  ): Promise<Preferences> {
    return this.repo.create(userId, prefs)
  }

  private async _update(
    userId: string,
    prefs: Preferences,
  ): Promise<Preferences> {
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
