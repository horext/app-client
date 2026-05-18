import type { IGenerationMeta, IGenerationRecord } from '~/interfaces/generation-record'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface IGenerationService {
  getGenerations(): Promise<IGenerationRecord[]>
  getLatestGeneration(): Promise<IGenerationRecord | undefined>
  saveGeneration(
    meta: IGenerationMeta,
    schedules: IScheduleGenerate[],
    maxHistory: number,
  ): Promise<IGenerationRecord>
  getSchedulesForGeneration(
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]>
}
