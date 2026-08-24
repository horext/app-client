import { CollectionSyncUseCase } from './collection-sync.use-case'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { CollectionResourceSnapshotGateway } from '../ports/collection-resource-snapshot.gateway'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { ReplicaStore } from './aggregate-sync.use-case'
import { PlannedSubjectPersistenceMapper } from '~~/modules/schedules-storage/runtime/app/mappers'

export class SubjectsSyncUseCase extends CollectionSyncUseCase<
  IPlannedSubject,
  SyncResource.SUBJECTS
> {
  constructor(
    api: CollectionResourceSnapshotGateway<SyncResource.SUBJECTS>,
    private readonly localRepository: ISubjectsRepository,
    protected readonly repository: ReplicaStore<IPlannedSubject>,
  ) {
    super(api, (record) => record)
  }
  protected readonly resource = SyncResource.SUBJECTS
  async localSnapshot(userId: string) {
    return (await this.localRepository.findAll(userId)).map((value) => ({
      id: value.id,
      data: PlannedSubjectPersistenceMapper.toRecord(value),
    }))
  }
}
