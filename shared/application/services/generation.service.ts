import type {
  ScheduleGenerationId,
  IBaseScheduleGeneration,
  IScheduleGenerationCreate,
  IScheduleGenerationParameters,
  IScheduleGeneration,
  IScheduleGenerationResult,
} from '#shared/domain/types/schedule-generation'
import { ScheduleGeneration, GeneratedSchedule } from '#shared/domain'
import type { IIntersectionOccurrence } from '#shared/domain/types/occurrences'
import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IGenerationService } from '../interfaces/generation.service'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class GenerationService implements IGenerationService {
  constructor(
    private readonly generationRepo: IGenerationRepository,
    private readonly schedulesRepo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
  ) {}

  get(userId: string, id: ScheduleGenerationId) {
    return this.generationRepo.findById(userId, id)
  }

  create(
    userId: string,
    value: IScheduleGenerationCreate,
    id?: ScheduleGenerationId,
  ) {
    return this.generationRepo.create(
      userId,
      ScheduleGeneration.create({
        ...value,
        ...(id ? { externalId: id } : {}),
      }),
    )
  }

  async patch(
    userId: string,
    id: ScheduleGenerationId,
    value: { revision: number },
  ) {
    const current = await this.get(userId, id)
    if (!current) throw new ResourceNotFoundError('generation')
    return this.generationRepo.update(userId, current.update(value))
  }

  delete(userId: string, id: ScheduleGenerationId, revision?: number) {
    return this.generationRepo.delete(userId, id, revision)
  }

  async getGenerations(userId: string): Promise<IScheduleGeneration[]> {
    const records = await this.generationRepo.findAll(userId)
    return records
      .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))
      .map((record) => record.toSnapshot())
  }

  async getLatestGeneration(
    userId: string,
  ): Promise<IScheduleGenerationResult | undefined> {
    const records = await this.getGenerations(userId)
    const latest = records[records.length - 1]
    if (!latest) return undefined
    const schedules = await this.schedulesRepo.getEntries(
      userId,
      latest.scheduleIds,
    )
    return {
      ...latest,
      schedules: schedules.map((schedule) => schedule.toSnapshot()),
    }
  }

  async saveGeneration(
    userId: string,
    parameters: IScheduleGenerationParameters,
    schedules: IBaseGeneratedSchedule[],
    occurrences: IIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IScheduleGenerationResult> {
    const schedulesToSave = schedules.map((schedule) =>
      GeneratedSchedule.create(schedule),
    )
    const savedSchedules = await this.schedulesRepo.createAll(
      userId,
      schedulesToSave,
    )

    let savedRecord: ScheduleGeneration
    try {
      const record: IBaseScheduleGeneration = {
        generatedAt: new Date().toISOString(),
        resultCount: schedules.length,
        occurrences,
        ...parameters,
        scheduleIds: savedSchedules.map((schedule) => schedule.id),
      }

      savedRecord = await this.generationRepo.create(
        userId,
        ScheduleGeneration.create(record),
      )
    } catch (error) {
      try {
        await this.schedulesRepo.deleteEntries(
          userId,
          savedSchedules.map((schedule) => schedule.id),
        )
      } catch {
        // Preserve the generation-write failure; cleanup can be retried later.
      }
      throw error
    }

    // 3. Trim history and clean orphaned schedules
    await this._trimAndCleanup(userId, maxHistory)

    return {
      ...savedRecord.toSnapshot(),
      schedules: savedSchedules.map((schedule) => schedule.toSnapshot()),
      occurrences,
    }
  }

  async getSchedulesForGeneration(
    userId: string,
    record: IScheduleGeneration,
  ): Promise<IGeneratedSchedule[]> {
    return (
      await this.schedulesRepo.getEntries(userId, record.scheduleIds)
    ).map((schedule) => schedule.toSnapshot())
  }

  private async _trimAndCleanup(
    userId: string,
    maxHistory: number,
  ): Promise<void> {
    const records = await this.getGenerations(userId)
    if (records.length <= maxHistory) return

    // Oldest records to remove
    const toRemove = records.slice(0, records.length - maxHistory)

    for (const r of toRemove) {
      await this.generationRepo.delete(userId, r.id)
    }

    // Compute which schedule IDs are still referenced
    const remaining = records.slice(records.length - maxHistory)
    const referencedIds = new Set(remaining.flatMap((r) => r.scheduleIds))

    // Also keep favorites
    const favoriteIds = (await this.favoritesRepo.findAll(userId)).map(
      (favorite) => favorite.id,
    )
    for (const id of favoriteIds) referencedIds.add(id)

    // Collect all orphaned schedule IDs from removed records
    const orphanIds = toRemove
      .flatMap((r) => r.scheduleIds)
      .filter((id) => !referencedIds.has(id))

    if (orphanIds.length > 0) {
      await this.schedulesRepo.deleteEntries(userId, orphanIds)
    }
  }
}
