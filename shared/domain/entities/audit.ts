import type { IEntityMetadata } from '../types/entity-metadata'

export function auditEntity<T extends Partial<IEntityMetadata>>(
  value: T,
  userId: string,
): T & Partial<IEntityMetadata> {
  return {
    ...value,
    createdBy: value.createdBy ?? userId,
    updatedBy: userId,
  }
}
