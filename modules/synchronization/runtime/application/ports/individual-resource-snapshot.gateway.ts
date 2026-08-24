import type {
  AggregateSnapshot,
  IndividualResource,
  SyncBodyMap,
} from '~~/modules/synchronization/runtime/contracts'

export interface ResourceMutationResponse {
  headers: Headers
}

export interface IndividualResourceSnapshotGateway<
  R extends IndividualResource,
> {
  get(): Promise<Required<AggregateSnapshot<SyncBodyMap<R>>>>
  create(
    body: SyncBodyMap<R>,
    operationId: string,
  ): Promise<ResourceMutationResponse>
  update(
    body: SyncBodyMap<R>,
    revision: number,
  ): Promise<ResourceMutationResponse>
}
