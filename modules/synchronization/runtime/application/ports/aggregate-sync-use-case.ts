import type {
  AggregateSnapshot,
  SyncBodyMap,
  SyncOperationDto,
  SyncResource,
} from '~~/modules/synchronization/runtime/contracts'

export interface AggregateSyncUseCase {
  localSnapshot(userId: string): Promise<AggregateSnapshot<SyncBodyMap>[]>
  cloudSnapshot(): Promise<AggregateSnapshot<SyncBodyMap>[]>
  replaceLocal(
    userId: string,
    snapshots: AggregateSnapshot<SyncBodyMap>[],
  ): Promise<void>
  create(item: AggregateSnapshot<SyncBodyMap>): SyncOperationDto
  update(item: AggregateSnapshot<SyncBodyMap>): SyncOperationDto
  applyUpsert(userId: string, data: unknown): Promise<void>
  applyDelete(userId: string, id: string): Promise<void>
  cloudDeletionOperations(): Promise<SyncOperationDto[]>
}

export interface AggregateSyncRegistration {
  resource: SyncResource
  useCase: AggregateSyncUseCase
}
