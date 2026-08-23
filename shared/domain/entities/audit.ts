import type { IAuditable } from '../types/entity-metadata'

export class Audit implements IAuditable {
  private constructor(
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly createdBy: string,
    readonly updatedBy: string,
  ) {}

  static reconstitute(value: IAuditable): Audit {
    return new Audit(
      value.createdAt,
      value.updatedAt,
      value.createdBy,
      value.updatedBy,
    )
  }
}

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
