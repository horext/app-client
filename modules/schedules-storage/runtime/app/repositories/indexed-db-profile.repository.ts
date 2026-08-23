import type { BaseProfile, Profile } from '#shared/domain'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type { AggregatePersistence } from '../persistence/aggregate-persistence'
import { StoresDB } from '../context/db'
import { ProfilePersistenceMapper } from '../mappers/persistence'

export class IndexedDBProfileRepository implements IProfileRepository {
  constructor(private readonly persistence: AggregatePersistence) {}

  async get(userId: string): Promise<Profile | undefined> {
    const [record] = await this.persistence.findAll(StoresDB.PROFILE, userId)
    return record ? ProfilePersistenceMapper.fromRecord(record) : undefined
  }

  async create(userId: string, profile: BaseProfile): Promise<Profile> {
    const stored = await this.persistence.create(
      StoresDB.PROFILE,
      ProfilePersistenceMapper.toCreateRecord(profile),
      userId,
    )
    return ProfilePersistenceMapper.fromRecord(stored)
  }

  async update(userId: string, profile: Profile): Promise<Profile> {
    const stored = await this.persistence.update(
      StoresDB.PROFILE,
      ProfilePersistenceMapper.toRecord(profile),
      userId,
    )
    return ProfilePersistenceMapper.fromRecord(stored)
  }
}
