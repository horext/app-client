import type { IAuditable } from '#shared/domain/types/entity-metadata'
import { makeUUID, type BrandUUID } from '~~/shared/domain/types/ids'

export function persistedSnapshot<
  T extends object,
  ID extends BrandUUID<string>,
>(snapshot: T): T & { id: ID } & IAuditable {
  return {
    ...snapshot,
    id: makeUUID(),
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
  }
}
