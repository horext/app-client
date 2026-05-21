import type { IGenerationMeta, IGenerationRecord, IGenerationResult } from '~/interfaces/generation-record'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerate } from '~/interfaces/schedule'

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
