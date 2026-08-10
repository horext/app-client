import type { IAuditable } from '../types/entity-metadata'

export function auditEntity<T extends Partial<IAuditable>>(
  value: T,
  userId: string,
): T & Partial<IAuditable> {
  return {
    ...value,
    createdBy: value.createdBy ?? userId,
    updatedBy: userId,
  }
}
