import type { IGenerationRecord } from '~/interfaces/generation-record'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export interface IGenerationService {
  getGenerations(): Promise<IGenerationRecord[]>
  getLatestGeneration(): Promise<IGenerationRecord | undefined>
  saveGeneration(
    record: IGenerationRecord,
    schedules: IScheduleGenerate[],
    maxHistory: number,
  ): Promise<void>
  getSchedulesForGeneration(
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]>
}
