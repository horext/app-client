import type { UUID } from 'crypto'
import type { SnapshotSource } from '../synchronization'

export interface IEntitySnapshot<T extends object> extends SnapshotSource<T> {
  id: UUID
}
