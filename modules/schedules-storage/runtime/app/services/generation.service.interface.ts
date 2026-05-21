import type {
  IGenerationMeta,
  IGenerationRecord,
  IGenerationResult,
} from '../../shared/interfaces/generation-record'
import type { IIntersectionOccurrence } from '../../shared/interfaces/ocurrences'
import type { IScheduleGenerate } from '../../shared/interfaces/schedule'

export interface IGenerationService {
  getGenerations(): Promise<IGenerationRecord[]>
  getLatestGeneration(): Promise<IGenerationResult | undefined>
  saveGeneration(
    meta: IGenerationMeta,
    schedules: IScheduleGenerate[],
    occurrences: IIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult>
  getSchedulesForGeneration(
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]>
}
