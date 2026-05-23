import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../../shared/interfaces/generation-record'

export interface IGenerationRepository {
  getAll(): Promise<IGenerationRecord[]>
  get(id: IGenerationRecord['id']): Promise<IGenerationRecord | undefined>
  create(record: IBaseGenerationRecord): Promise<IGenerationRecord>
  delete(id: IGenerationRecord['id']): Promise<void>
}
