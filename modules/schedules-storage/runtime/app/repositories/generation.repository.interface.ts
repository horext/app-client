import type { UUID } from 'crypto'
import type { Generation } from '../../shared/domain'

export interface IGenerationRepository {
  getAll(userId: string): Promise<Generation[]>
  get(userId: string, id: UUID): Promise<Generation | undefined>
  create(userId: string, record: Generation): Promise<Generation>
  delete(userId: string, id: UUID): Promise<void>
}
