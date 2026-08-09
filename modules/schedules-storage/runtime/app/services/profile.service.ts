import type { IBaseProfile, IProfile } from '../../shared/interfaces/profile'
import type { IProfileRepository } from '../repositories/profile-repository.interface'
import type { IProfileService } from './profile.service.interface'
import { Profile } from '../../shared/domain'

export class ProfileService implements IProfileService {
  constructor(private readonly repo: IProfileRepository) {}

  private async _load(userId: string): Promise<Profile<IProfile> | undefined> {
    return this.repo.get(userId)
  }

  private async _create(
    userId: string,
    profile: Profile<IBaseProfile>,
  ): Promise<Profile<IProfile>> {
    return this.repo.create(userId, profile)
  }

  private async _update(
    userId: string,
    profile: Profile<IProfile>,
  ): Promise<Profile<IProfile>> {
    return this.repo.update(userId, profile)
  }

  async getProfile(userId: string): Promise<IProfile | undefined> {
    return (await this._load(userId))?.toSnapshot()
  }

  async createProfile(
    userId: string,
    initial: IBaseProfile,
  ): Promise<IProfile> {
    const existing = await this._load(userId)
    if (existing) return existing.toSnapshot()
    const profile = Profile.create(initial)
    return (await this._create(userId, profile)).toSnapshot()
  }

  async patch(userId: string, partial: Partial<IBaseProfile>): Promise<void> {
    const profile = await this._load(userId)
    if (!profile) return
    await this._update(userId, profile.update(partial))
  }
}
