import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'

export interface ILocalHourlyLoadService {
  get(userId: string): Promise<ILocalHourlyLoadDataset | undefined>
  activate(userId: string, dataset: ILocalHourlyLoadDataset): Promise<void>
  clear(userId: string): Promise<void>
}
