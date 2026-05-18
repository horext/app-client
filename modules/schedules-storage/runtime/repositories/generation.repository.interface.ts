import type { IGenerationRecord } from '~/interfaces/generation-record'

export interface IGenerationRepository {
  getAll(): Promise<IGenerationRecord[]>
  get(id: string): Promise<IGenerationRecord | undefined>
  save(record: IGenerationRecord): Promise<void>
  delete(id: string): Promise<void>
}
