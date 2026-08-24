import type { RemoteChange } from '../../domain/models/remote-change'
import type {
  RemoteCloudRecord,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'

export interface CloudChangeApplier {
  applyCloudRecord(
    userId: string,
    record: RemoteCloudRecord,
    revision: number,
  ): Promise<void>
  apply<R extends SyncResource>(
    userId: string,
    resource: R,
    change: RemoteChange<R>,
  ): Promise<void>
}
