import type { IUserProfile } from '~/interfaces/profile'
import type { IOrganization } from '~/interfaces/organization'
import type { IProfileRepository } from '../repositories/profile-repository.interface'
import type { IProfileService } from './profile.service.interface'
import { UserProfile } from '../domain/UserProfile'

export class ProfileService implements IProfileService {
  constructor(private readonly repo: IProfileRepository) {}

  private async _load(): Promise<UserProfile | undefined> {
    const data = await this.repo.get()
    return data ? UserProfile.from(data) : undefined
  }

  private async _save(profile: UserProfile): Promise<void> {
    await this.repo.save(profile.toData())
  }

  async getProfile(): Promise<IUserProfile | undefined> {
    return (await this._load())?.toData()
  }

  async createProfile(): Promise<IUserProfile> {
    const existing = await this._load()
    if (existing) return existing.toData()
    const profile = UserProfile.create()
    await this._save(profile)
    return profile.toData()
  }

  async patch(partial: Partial<Omit<IUserProfile, 'id'>>): Promise<void> {
    const profile = await this._load()
    if (!profile) return
    await this._save(profile.patch(partial))
  }

  async completeSetup(faculty: IOrganization | null, speciality: IOrganization | null): Promise<void> {
    const profile = await this._load()
    if (!profile) return
    await this._save(profile.completeSetup(faculty, speciality))
  }
}
