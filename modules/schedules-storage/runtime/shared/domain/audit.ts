import type { IEntityMetadata } from '../interfaces/entity-metadata'

export function auditEntity<Value extends IEntityMetadata>(
  value: Value,
  userId: string,
): Value {
  return {
    ...value,
    createdBy: value.createdBy === 'local' ? userId : value.createdBy,
    updatedBy: userId,
  }
}
