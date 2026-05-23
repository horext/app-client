import type { IUserProfile } from '../../shared/interfaces/profile'
import type { IProfileRepository } from './profile-repository.interface'
import { type DbFactory, StoresDB } from '../context/db'

const PROFILE_KEY: IUserProfile['id'] = 'profile'

export class IndexedDBProfileRepository implements IProfileRepository {
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<IUserProfile | undefined> {
    const db = await this.getDb()
    return db.get(StoresDB.PROFILE, PROFILE_KEY)
  }

  async save(profile: IUserProfile): Promise<void> {
    const db = await this.getDb()
    await db.put(StoresDB.PROFILE, profile)
  }
}
