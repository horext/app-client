import { vi } from 'vitest'
import type {
  CollectionResource,
  IndividualResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'
import type { CollectionResourceSnapshotGateway } from '../../ports/collection-resource-snapshot.gateway'
import type { IndividualResourceSnapshotGateway } from '../../ports/individual-resource-snapshot.gateway'
import type { ReplicaRepository } from '../../ports/replica-repository'

export function replica<T extends { id: ID }, ID = string>(): ReplicaRepository<
  T,
  ID
> {
  return { upsert: vi.fn(), delete: vi.fn(), replace: vi.fn() }
}

export function collectionGateway<
  R extends CollectionResource,
>(): CollectionResourceSnapshotGateway<R> {
  return {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    list: vi.fn().mockResolvedValue({ items: [], nextCursor: null }),
  }
}

export function individualGateway<R extends IndividualResource>(
  item: Required<{
    id: string
    data: SyncBodyMap<R>
    revision: number
    createdAt: string
    updatedAt: string
  }>,
): IndividualResourceSnapshotGateway<R> {
  return {
    create: vi.fn(),
    update: vi.fn(),
    get: vi.fn().mockResolvedValue(item),
  }
}
