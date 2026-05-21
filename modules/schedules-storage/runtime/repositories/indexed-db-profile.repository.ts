import { toRaw } from 'vue'
import type { IUserProfile } from '~/interfaces/profile'
import type { IProfileRepository } from './profile-repository.interface'
import type { DbFactory } from '../context/db'

const PROFILE_KEY: IUserProfile['id'] = 'profile'

export class IndexedDBProfileRepository implements IProfileRepository {
private static STORE_NAME = 'profile' as const
  constructor(private readonly getDb: DbFactory) {}

  async get(): Promise<IUserProfile | undefined> {
    const db = await this.getDb()
    return db.get(IndexedDBProfileRepository.STORE_NAME, PROFILE_KEY)
  }

  async save(profile: IUserProfile): Promise<void> {
    const db = await this.getDb()
    await db.put(IndexedDBProfileRepository.STORE_NAME, toRaw(profile))
  }
}
