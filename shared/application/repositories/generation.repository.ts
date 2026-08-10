import type { UUID } from 'crypto'
import type { Generation } from '#shared/domain'
import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '#shared/domain/types/generation-record'

export interface IGenerationRepository {
  getAll(userId: string): Promise<Generation[]>
  get(userId: string, id: UUID): Promise<Generation | undefined>
  create(
    userId: string,
    record: Generation<IBaseGenerationRecord>,
  ): Promise<Generation<IGenerationRecord>>
  delete(userId: string, id: UUID, expectedRevision?: number): Promise<void>
}
