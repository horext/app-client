import type {
  IScheduleGenerationParameters,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'
import type {
  IBaseIntersectionOccurrence,
  IIntersectionOccurrence,
} from '#shared/domain/types/occurrences'
import type { IBaseGeneratedSchedule } from '#shared/domain/types/schedule'
import type { GeneratedSchedule, ScheduleGeneration } from '#shared/domain'

export interface GenerationResult {
  generation: ScheduleGeneration
  schedules: GeneratedSchedule[]
  occurrences: IIntersectionOccurrence[]
}

export interface IGenerationService {
  getGenerations(userId: string): Promise<ScheduleGeneration[]>
  getLatestGeneration(userId: string): Promise<GenerationResult | undefined>
  saveGeneration(
    userId: string,
    parameters: IScheduleGenerationParameters,
    schedules: IBaseGeneratedSchedule[],
    occurrences: IBaseIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<GenerationResult>
  getSchedulesForGeneration(
    userId: string,
    record: IScheduleGeneration,
  ): Promise<GeneratedSchedule[]>
}
