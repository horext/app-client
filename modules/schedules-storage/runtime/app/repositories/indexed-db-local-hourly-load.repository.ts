import type { ILocalHourlyLoadRepository } from '#shared/application/repositories/local-hourly-load.repository'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'
import type { DbFactory } from '../context/db'
import { StoresDB } from '../context/db'

export class IndexedDBLocalHourlyLoadRepository implements ILocalHourlyLoadRepository {
  constructor(private readonly database: DbFactory) {}

  async get(userId: string) {
    const database = await this.database()
    const record = await database.get(StoresDB.LOCAL_HOURLY_LOAD, userId)
    return record?.dataset
  }

  async save(userId: string, dataset: ILocalHourlyLoadDataset) {
    const database = await this.database()
    await database.put(StoresDB.LOCAL_HOURLY_LOAD, {
      userId,
      dataset: structuredClone(dataset),
    })
  }

  async remove(userId: string) {
    const database = await this.database()
    await database.delete(StoresDB.LOCAL_HOURLY_LOAD, userId)
  }
}
