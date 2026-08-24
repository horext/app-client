import type { CloudChangeApplier } from '../ports/cloud-change-applier'
import type { InitialSyncStrategy } from '../use-cases/initial-sync-coordinator'
import type { SyncConflict } from './cloud-sync.service'

interface SynchronizationService {
  conflicts(userId: string): Promise<SyncConflict[]>
  pull(userId: string, handler: CloudChangeApplier): Promise<number>
  push(userId: string): Promise<{ pushed: number; conflicts: number }>
  resolve(
    userId: string,
    key: string,
    choice: 'local' | 'cloud',
    handler: CloudChangeApplier,
  ): Promise<void>
}

interface InitialSynchronization extends CloudChangeApplier {
  hasLocalData(userId: string): Promise<boolean>
  run(userId: string, strategy: InitialSyncStrategy): Promise<void>
}

/** Application-facing synchronization entry point. */
export class SynchronizationFacade {
  constructor(
    private readonly service: SynchronizationService,
    private readonly initial: InitialSynchronization,
  ) {}

  conflicts(userId: string): Promise<SyncConflict[]> {
    return this.service.conflicts(userId)
  }

  async start(userId: string): Promise<void> {
    if (await this.initial.hasLocalData(userId)) return
    await this.pullAndPush(userId)
  }

  hasLocalData(userId: string): Promise<boolean> {
    return this.initial.hasLocalData(userId)
  }

  initialize(userId: string, strategy: InitialSyncStrategy): Promise<void> {
    return this.initial.run(userId, strategy)
  }

  pullAndPush(
    userId: string,
    handler: CloudChangeApplier = this.initial,
  ): Promise<void> {
    return this.runPullAndPush(userId, handler)
  }

  resolve(
    userId: string,
    key: string,
    choice: 'local' | 'cloud',
  ): Promise<void> {
    return this.service.resolve(userId, key, choice, this.initial)
  }

  private async runPullAndPush(
    userId: string,
    handler: CloudChangeApplier,
  ): Promise<void> {
    await this.service.pull(userId, handler)
    await this.service.push(userId)
  }
}
