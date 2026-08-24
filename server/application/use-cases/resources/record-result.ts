import type { Clock, RecordResult } from '../shared/contracts'

export function createRecordResult<T extends object>(
  id: string,
  data: T,
  revision: number,
  clock: Clock,
): RecordResult<T> {
  const now = clock.now().toISOString()
  const createdAt =
    'createdAt' in data && typeof data.createdAt === 'string'
      ? data.createdAt
      : now
  const updatedAt =
    'updatedAt' in data && typeof data.updatedAt === 'string'
      ? data.updatedAt
      : now
  return { id, data, revision, createdAt, updatedAt, deletedAt: null }
}
