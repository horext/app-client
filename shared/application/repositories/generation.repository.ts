import type { BaseScheduleGeneration, ScheduleGeneration } from '#shared/domain'
import type { ScheduleGenerationId } from '#shared/domain/types/schedule-generation'

export interface IGenerationRepository {
  findAll(userId: string): Promise<ScheduleGeneration[]>
  findById(
    userId: string,
    id: ScheduleGenerationId,
  ): Promise<ScheduleGeneration | undefined>
  create(
    userId: string,
    record: BaseScheduleGeneration,
  ): Promise<ScheduleGeneration>
  update(
    userId: string,
    record: ScheduleGeneration,
  ): Promise<ScheduleGeneration>
  delete(
    userId: string,
    id: ScheduleGenerationId,
    expectedRevision?: number,
  ): Promise<void>
}
