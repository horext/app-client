import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'

export interface ILocalHourlyLoadRepository {
  get(userId: string): Promise<ILocalHourlyLoadDataset | undefined>
  save(userId: string, dataset: ILocalHourlyLoadDataset): Promise<void>
  remove(userId: string): Promise<void>
}
