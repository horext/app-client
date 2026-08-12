import type { Generation } from '#shared/domain'
import type {
  GenerationId,
  IBaseGenerationRecord,
  IGenerationRecord,
} from '#shared/domain/types/generation-record'

export interface IGenerationRepository {
  findAll(userId: string): Promise<Generation[]>
  findById(userId: string, id: GenerationId): Promise<Generation | undefined>
  create(
    userId: string,
    record: Generation<IBaseGenerationRecord>,
  ): Promise<Generation<IGenerationRecord>>
  update(
    userId: string,
    record: Generation<IGenerationRecord>,
  ): Promise<Generation<IGenerationRecord>>
  delete(
    userId: string,
    id: GenerationId,
    expectedRevision?: number,
  ): Promise<void>
}
