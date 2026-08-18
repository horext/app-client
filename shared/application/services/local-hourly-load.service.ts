import type { ILocalHourlyLoadService } from '../interfaces/local-hourly-load.service'
import type { ILocalHourlyLoadRepository } from '../repositories/local-hourly-load.repository'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'

export class LocalHourlyLoadService implements ILocalHourlyLoadService {
  constructor(private readonly repository: ILocalHourlyLoadRepository) {}

  get(userId: string) {
    return this.repository.get(userId)
  }

  activate(userId: string, dataset: ILocalHourlyLoadDataset) {
    return this.repository.save(userId, structuredClone(dataset))
  }

  clear(userId: string) {
    return this.repository.remove(userId)
  }
}
