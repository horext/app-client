import type { RemoteCloudRecord } from '~~/modules/synchronization/runtime/contracts'
import type { CloudChangeApplier } from './cloud-change-applier'

export interface CloudConflictResponse {
  status?: number
  data?: CloudConflictData
}

export interface CloudConflictData {
  current?: RemoteCloudRecord
  revision?: number
}

export interface AppliedCloudChanges {
  applied: number
  cursor: string
  hasMore: boolean
}

export interface CloudChangesGateway {
  changes(
    cursor: string | undefined,
    handler: CloudChangeApplier,
    userId: string,
  ): Promise<AppliedCloudChanges>
  applyCloudRecord(
    userId: string,
    handler: CloudChangeApplier,
    record: RemoteCloudRecord,
    revision: number,
  ): Promise<void>
  conflict(error: unknown): CloudConflictResponse | undefined
}
