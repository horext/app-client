import type { IUserPreferences } from '../../shared/interfaces/preferences'
import type { IPreferencesRepository } from '../repositories/preferences-repository.interface'
import type { IPreferencesService } from './preferences.service.interface'
import { UserPreferences } from '../domain/UserPreferences'

export class PreferencesService implements IPreferencesService {
  constructor(private readonly repo: IPreferencesRepository) {}

  private async _load(): Promise<UserPreferences | undefined> {
    const data = await this.repo.get()
    return data ? UserPreferences.from(data) : undefined
  }

  private async _save(prefs: UserPreferences): Promise<void> {
    await this.repo.save(prefs.toData())
  }

  async getPreferences(): Promise<IUserPreferences | undefined> {
    return (await this._load())?.toData()
  }

  async createPreferences(): Promise<IUserPreferences> {
    const existing = await this._load()
    if (existing) return existing.toData()
    const prefs = UserPreferences.create()
    await this._save(prefs)
    return prefs.toData()
  }

  async patch(partial: Partial<Omit<IUserPreferences, 'id'>>): Promise<void> {
    const prefs = await this._load()
    if (!prefs) return
    await this._save(prefs.patch(partial))
  }
}
