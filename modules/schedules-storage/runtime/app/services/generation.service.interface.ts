import type {
  IGenerationMeta,
  IGenerationRecord,
  IGenerationResult,
} from '../../shared/interfaces/generation-record'
import type { IBaseIntersectionOccurrence } from '../../shared/interfaces/ocurrences'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../../shared/interfaces/schedule'

export interface IGenerationService {
  getGenerations(): Promise<IGenerationRecord[]>
  getLatestGeneration(): Promise<IGenerationResult | undefined>
  saveGeneration(
    meta: IGenerationMeta,
    schedules: IBaseScheduleGenerate[],
    occurrences: IBaseIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult>
  getSchedulesForGeneration(
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]>
}
