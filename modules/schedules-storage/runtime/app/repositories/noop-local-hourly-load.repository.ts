import type { ILocalHourlyLoadRepository } from '#shared/application/repositories/local-hourly-load.repository'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'

export class NoopLocalHourlyLoadRepository implements ILocalHourlyLoadRepository {
  async get() {
    return undefined
  }

  async save(_userId: string, _dataset: ILocalHourlyLoadDataset) {}

  async remove() {}
}
