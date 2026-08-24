import {
  SyncOperation,
  type PersistedSyncOperation,
  type SyncConflictRecord,
  type SyncOperationDto,
} from '~~/modules/synchronization/runtime/contracts'
import type { CloudChangeApplier } from '../ports/cloud-change-applier'
import type { CloudChangesGateway } from '../ports/cloud-changes-gateway'
import type { SyncOperationGateway } from '../ports/sync-operation-gateway'
import type { SyncStateRepository } from '../ports/sync-state.repository'

export type PendingOperation = PersistedSyncOperation
export type SyncConflict = SyncConflictRecord

/** Application service for synchronization use cases. */
export class CloudSyncService {
  constructor(
    private readonly api: CloudChangesGateway,
    private readonly operations: SyncOperationGateway,
    private readonly state: SyncStateRepository,
  ) {}

  enqueue(
    userId: string,
    operation: SyncOperationDto,
  ): Promise<PendingOperation> {
    return this.state.enqueue(userId, operation)
  }

  pending(userId: string): Promise<PendingOperation[]> {
    return this.state.pending(userId)
  }

  conflicts(userId: string): Promise<SyncConflict[]> {
    return this.state.conflicts(userId)
  }

  recordConflict(conflict: SyncConflict): Promise<void> {
    return this.state.saveConflict(conflict)
  }

  async push(userId: string): Promise<{ pushed: number; conflicts: number }> {
    const pending = await this.state.pending(userId)
    const operations = compactOperations(pending)
    const retained = new Set(operations.map((operation) => operation.key))
    await Promise.all(
      pending
        .filter((operation) => !retained.has(operation.key))
        .map((operation) => this.state.deletePending(operation.key)),
    )
    let pushed = 0
    let conflicts = 0
    for (const operation of operations) {
      try {
        const revision = await this.operations.push(operation)
        await this.state.confirm(
          operation,
          operation.operation !== SyncOperation.DELETE
            ? operation.body!.updatedAt
            : undefined,
          revision,
        )
        pushed += 1
      } catch (error: unknown) {
        const response = this.api.conflict(error)
        if (!response || ![409, 412].includes(response.status || 0)) throw error
        await this.state.saveConflict({
          key: operation.key,
          operation,
          cloud: response.data?.current,
          cloudRevision: response.data?.revision,
          createdAt: new Date().toISOString(),
        })
        await this.state.deletePending(operation.key)
        conflicts += 1
      }
    }
    return { pushed, conflicts }
  }

  async pull(userId: string, handler: CloudChangeApplier): Promise<number> {
    let cursor = await this.state.cursor(userId)
    let applied = 0
    let hasMore = true
    while (hasMore) {
      const response = await this.api.changes(cursor, handler, userId)
      cursor = response.cursor
      hasMore = response.hasMore
      applied += response.applied
      await this.state.saveCursor(userId, cursor)
    }
    return applied
  }

  async resolve(
    userId: string,
    conflictKey: string,
    choice: 'local' | 'cloud',
    handler: CloudChangeApplier,
  ): Promise<void> {
    const conflict = await this.state.conflict(userId, conflictKey)
    if (!conflict) return
    if (choice === 'local' && 'body' in conflict.operation)
      await this.enqueue(userId, {
        ...conflict.operation,
        operationId: crypto.randomUUID(),
        revision: conflict.cloudRevision,
      })
    else if (choice === 'cloud' && conflict.cloud) {
      const cloud = conflict.cloud
      await this.api.applyCloudRecord(
        userId,
        handler,
        cloud,
        conflict.cloudRevision ?? cloud.revision,
      )
    }
    await this.state.deleteConflict(conflictKey)
  }
}

export function compactOperations(
  operations: PendingOperation[],
): PendingOperation[] {
  const grouped = new Map<string, PendingOperation[]>()
  for (const operation of [...operations].sort(
    (left, right) =>
      (left.sequence ?? 0) - (right.sequence ?? 0) ||
      left.createdAt.localeCompare(right.createdAt),
  )) {
    const key = `${operation.resource}:${operation.entityId}`
    grouped.set(key, [...(grouped.get(key) ?? []), operation])
  }

  const compacted: PendingOperation[] = []
  for (const history of grouped.values()) {
    const first = history[0]
    if (!first) continue
    const latest = history.at(-1)!
    if (first.operation === SyncOperation.CREATE) {
      if (latest.operation === SyncOperation.DELETE) continue
      if (latest.operation === SyncOperation.CREATE) {
        compacted.push(latest)
        continue
      }
      compacted.push({
        ...latest,
        operation: SyncOperation.CREATE,
        revision: undefined,
        body: latest.body,
      } as PendingOperation)
      continue
    }

    const originalRevision = first.revision
    if (latest.operation === SyncOperation.DELETE) {
      compacted.push({ ...latest, revision: originalRevision })
    } else {
      compacted.push({ ...latest, revision: originalRevision })
    }
  }
  return compacted.sort((left, right) => left.sequence - right.sequence)
}
