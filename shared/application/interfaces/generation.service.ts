import type {
  IGenerationMeta,
  IGenerationRecord,
  IGenerationResult,
} from '#shared/domain/types/generation-record'
import type { IBaseIntersectionOccurrence } from '#shared/domain/types/occurrences'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'

export interface IGenerationService {
  getGenerations(userId: string): Promise<IGenerationRecord[]>
  getLatestGeneration(userId: string): Promise<IGenerationResult | undefined>
  saveGeneration(
    userId: string,
    meta: IGenerationMeta,
    schedules: IBaseScheduleGenerate[],
    occurrences: IBaseIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult>
  getSchedulesForGeneration(
    userId: string,
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]>
}
