import type { CloudChangeApplier } from '../../application/ports/cloud-change-applier'
import type {
  ExplicitChangesFeed,
  RemoteChange,
} from '../../domain/models/remote-change'
import type {
  CloudConflictResponse,
  CloudChangesGateway,
} from '../../application/ports/cloud-changes-gateway'
import {
  SyncResource,
  type RemoteCloudRecord,
} from '~~/modules/synchronization/runtime/contracts'
export class CloudSyncTransportGateway implements CloudChangesGateway {
  async changes(
    cursor: string | undefined,
    handler: CloudChangeApplier,
    userId: string,
  ) {
    const response = await $fetch<ExplicitChangesFeed>('/api/v1/changes', {
      query: { cursor, limit: 500 },
    })
    const apply = async <R extends SyncResource>(
      resource: R,
      changes: RemoteChange<R>[],
    ) => {
      for (const change of changes)
        await handler.apply(userId, resource, change)
    }
    await apply(SyncResource.PROFILE, response.profile)
    await apply(SyncResource.PREFERENCES, response.preferences)
    await apply(SyncResource.ACADEMIC_CONFIG, response.academicConfig)
    await apply(SyncResource.ACTIVITIES, response.activities)
    await apply(SyncResource.SUBJECTS, response.subjects)
    await apply(SyncResource.SCHEDULES, response.schedules)
    await apply(SyncResource.GENERATIONS, response.generations)
    await apply(SyncResource.FAVORITES, response.favorites)
    const applied =
      response.profile.length +
      response.preferences.length +
      response.academicConfig.length +
      response.activities.length +
      response.subjects.length +
      response.schedules.length +
      response.generations.length +
      response.favorites.length
    return {
      applied,
      cursor: response.cursor,
      hasMore: response.hasMore,
    }
  }
  conflict(error: unknown): CloudConflictResponse | undefined {
    if (!isCloudSyncTransportError(error)) return
    return {
      status: error.status,
      data: error.data && {
        current: error.data.current,
        revision: conflictRevision(error.data),
      },
    }
  }
  async applyCloudRecord(
    userId: string,
    handler: CloudChangeApplier,
    record: RemoteCloudRecord,
    revision: number,
  ) {
    return handler.applyCloudRecord(userId, record, revision)
  }
}

interface CloudSyncTransportError {
  status?: number
  data?: {
    current?: RemoteCloudRecord
    revision?: number
    etag?: string
  }
}

function isCloudSyncTransportError(
  value: unknown,
): value is CloudSyncTransportError {
  return value !== null && typeof value === 'object'
}

function conflictRevision(data: object): number | undefined {
  if ('revision' in data && typeof data.revision === 'number')
    return data.revision
  if ('etag' in data && typeof data.etag === 'string') {
    const revision = Number(data.etag.replaceAll('"', ''))
    if (Number.isInteger(revision) && revision >= 0) return revision
  }
}
