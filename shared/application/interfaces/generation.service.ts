import type {
  IScheduleGenerationParameters,
  IScheduleGeneration,
  IScheduleGenerationResult,
} from '#shared/domain/types/schedule-generation'
import type { IBaseIntersectionOccurrence } from '#shared/domain/types/occurrences'
import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'

export interface IGenerationService {
  getGenerations(userId: string): Promise<IScheduleGeneration[]>
  getLatestGeneration(
    userId: string,
  ): Promise<IScheduleGenerationResult | undefined>
  saveGeneration(
    userId: string,
    parameters: IScheduleGenerationParameters,
    schedules: IBaseGeneratedSchedule[],
    occurrences: IBaseIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IScheduleGenerationResult>
  getSchedulesForGeneration(
    userId: string,
    record: IScheduleGeneration,
  ): Promise<IGeneratedSchedule[]>
}
