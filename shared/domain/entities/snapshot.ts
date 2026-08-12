import type { UUID } from 'crypto'

export interface IEntitySnapshot<T extends object> {
  toSnapshot(): T

  id: UUID
}
