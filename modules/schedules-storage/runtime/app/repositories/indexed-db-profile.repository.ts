import type { IProfile } from '../../shared/interfaces/profile'
import { Profile } from '../../shared/domain'
import type { IProfileRepository } from './profile-repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

const PROFILE_KEY: IProfile['id'] = 'profile'

export class IndexedDBProfileRepository implements IProfileRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Profile | undefined> {
    const record = await this.persistence.find(
      StoresDB.PROFILE,
      userId,
      PROFILE_KEY,
    )
    return record ? Profile.restore(record) : undefined
  }

  async create(userId: string, profile: Profile): Promise<Profile> {
    const stored = await this.persistence.create(
      StoresDB.PROFILE,
      profile.toSnapshot(),
      userId,
    )
    return Profile.restore(stored)
  }

  async update(userId: string, profile: Profile): Promise<Profile> {
    const stored = await this.persistence.update(
      StoresDB.PROFILE,
      profile.toSnapshot(),
      userId,
    )
    return Profile.restore(stored)
  }
}
