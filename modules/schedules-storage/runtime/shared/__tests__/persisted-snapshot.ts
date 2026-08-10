import type { UUID } from 'crypto'
import type { IEntityMetadata } from '#shared/domain/types/entity-metadata'

export function persistedSnapshot<T extends object>(
  snapshot: T,
): T & { id: UUID } & IEntityMetadata {
  return {
    ...snapshot,
    id: crypto.randomUUID(),
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
  }
}
