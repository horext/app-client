import type {
  IBaseProfile,
  IProfile,
  IProfileUpdate,
} from '#shared/domain/types/profile'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { IProfileService } from '../interfaces/profile.service'
import { Profile } from '#shared/domain'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class ProfileService implements IProfileService {
  constructor(private readonly repo: IProfileRepository) {}

  private async _load(userId: string): Promise<Profile<IProfile> | undefined> {
    return this.repo.get(userId)
  }

  private async _create(
    userId: string,
    initial: IBaseProfile,
  ): Promise<Profile<IProfile>> {
    const profile = Profile.create(initial)
    return this.repo.create(userId, profile)
  }

  private async _update(
    userId: string,
    profile: Profile<IProfile>,
  ): Promise<Profile<IProfile>> {
    return this.repo.update(userId, profile)
  }

  async get(userId: string): Promise<Profile<IProfile> | undefined> {
    return this._load(userId)
  }

  async create(
    userId: string,
    initial: IBaseProfile,
  ): Promise<Profile<IProfile>> {
    const existing = await this._load(userId)
    if (existing) return this._update(userId, existing.update(initial))
    return this._create(userId, initial)
  }

  async patch(
    userId: string,
    value: IProfileUpdate,
  ): Promise<Profile<IProfile>> {
    const existing = await this._load(userId)
    if (!existing) throw new ResourceNotFoundError('profile')
    return this._update(userId, existing.update(value))
  }
}
