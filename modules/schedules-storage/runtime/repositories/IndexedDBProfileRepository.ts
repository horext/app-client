import { toRaw } from 'vue'
import type { IUserProfile } from '~/interfaces/profile'
import type { IProfileRepository } from '../interfaces/profile-repository'
import type { DbFactory } from '../db'

const PROFILE_KEY: IUserProfile['id'] = 'profile'

export class IndexedDBProfileRepository implements IProfileRepository {
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<IUserProfile | undefined> {
    const db = await this.getDb()
    return db.get('profile', PROFILE_KEY)
  }

  async save(profile: IUserProfile): Promise<void> {
    const db = await this.getDb()
    await db.put('profile', toRaw(profile))
  }
}
