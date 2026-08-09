import type { IBaseProfile, IProfile } from '../../shared/interfaces/profile'
import { Profile } from '../../shared/domain'
import type { IProfileRepository } from './profile-repository.interface'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'

export class IndexedDBProfileRepository implements IProfileRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Profile<IProfile> | undefined> {
    const [record] = await this.persistence.findAll(StoresDB.PROFILE, userId)
    return record ? Profile.restore(record) : undefined
  }

  async create(
    userId: string,
    profile: Profile<IBaseProfile>,
  ): Promise<Profile<IProfile>> {
    const stored = await this.persistence.create(
      StoresDB.PROFILE,
      {
        ...profile.toSnapshot(),
        setupCompleted: profile.toSnapshot().setupCompleted ?? false,
      },
      userId,
    )
    return Profile.restore(stored)
  }

  async update(
    userId: string,
    profile: Profile<IProfile>,
  ): Promise<Profile<IProfile>> {
    const stored = await this.persistence.update(
      StoresDB.PROFILE,
      profile.toSnapshot(),
      userId,
    )
    return Profile.restore(stored)
  }
}
