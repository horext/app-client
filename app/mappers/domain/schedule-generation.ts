import type { ScheduleGeneration } from '~~/shared/domain'
import type { IScheduleGeneration } from '~/interfaces/schedule-generation'
import type { ScheduleGenerationId } from '~~/shared/domain/types/schedule-generation'

export function toScheduleGenerationDto(
  entity: ScheduleGeneration,
): IScheduleGeneration & { id: ScheduleGenerationId } {
  return {
    id: entity.id,
    generatedAt: entity.generatedAt,
    scheduleIds: structuredClone(entity.scheduleIds),
    resultCount: entity.resultCount,
    occurrences: structuredClone(entity.occurrences),
    crossingsSetting: entity.crossingsSetting,
    weekDays: structuredClone(entity.weekDays),
    hourlyLoadId: entity.hourlyLoadId,
  }
}
