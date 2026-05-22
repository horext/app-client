import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../../shared/interfaces/generation-record'

export interface IGenerationRepository {
  getAll(): Promise<IGenerationRecord[]>
  get(id: string): Promise<IGenerationRecord | undefined>
  create(record: IBaseGenerationRecord): Promise<IGenerationRecord>
  delete(id: string): Promise<void>
}
