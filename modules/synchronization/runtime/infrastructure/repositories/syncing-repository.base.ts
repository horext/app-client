import type {
  SyncBodyMap,
  SyncCreateBodyMap,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'
import type { SyncOutbox } from '../indexed-db/sync-outbox-base'

/** Shared create/update behavior for both synchronization resource shapes. */
export abstract class BaseSyncingRepository<T, C, R extends SyncResource> {
  constructor(
    protected readonly outbox: SyncOutbox<R>,
    protected readonly restore: (snapshot: SyncBodyMap<R>) => T,
    protected readonly serializeCreate: (value: C) => SyncCreateBodyMap<R>,
    protected readonly serializeUpdate: (value: T) => SyncBodyMap<R>,
  ) {}

  async create(userId: string, value: C): Promise<T> {
    return this.restore(
      await this.outbox.create(userId, this.serializeCreate(value)),
    )
  }

  async update(userId: string, value: T): Promise<T> {
    return this.restore(
      await this.outbox.update(userId, this.serializeUpdate(value)),
    )
  }
}
