import type { ScheduleGeneration } from '#shared/domain'
import type {
  ScheduleGenerationId,
  IBaseScheduleGeneration,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'

export interface IGenerationRepository {
  findAll(userId: string): Promise<ScheduleGeneration[]>
  findById(
    userId: string,
    id: ScheduleGenerationId,
  ): Promise<ScheduleGeneration | undefined>
  create(
    userId: string,
    record: ScheduleGeneration<IBaseScheduleGeneration>,
  ): Promise<ScheduleGeneration<IScheduleGeneration>>
  update(
    userId: string,
    record: ScheduleGeneration<IScheduleGeneration>,
  ): Promise<ScheduleGeneration<IScheduleGeneration>>
  delete(
    userId: string,
    id: ScheduleGenerationId,
    expectedRevision?: number,
  ): Promise<void>
}
