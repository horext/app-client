import type { Clock, RepresentationResult } from '../shared/contracts'

export function createRepresentationResult(
  id: string,
  data: object,
  revision: number,
  status: number,
  clock: Clock,
): RepresentationResult {
  const now = clock.now().toISOString()
  return {
    record: {
      id,
      data,
      revision,
      createdAt:
        'createdAt' in data && typeof data.createdAt === 'string'
          ? data.createdAt
          : now,
      updatedAt:
        'updatedAt' in data && typeof data.updatedAt === 'string'
          ? data.updatedAt
          : now,
      deletedAt: null,
    },
    revision,
    status,
  }
}
