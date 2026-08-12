import type {
  GenerationId,
  IBaseGenerationRecord,
  IGenerationMeta,
  IGenerationRecord,
  IGenerationResult,
} from '#shared/domain/types/generation-record'
import { Generation, Schedule } from '#shared/domain'
import type { IIntersectionOccurrence } from '#shared/domain/types/occurrences'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '#shared/domain/types/schedule'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IGenerationService } from '../interfaces/generation.service'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { UUID } from 'crypto'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class GenerationService implements IGenerationService {
  constructor(
    private readonly generationRepo: IGenerationRepository,
    private readonly schedulesRepo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
  ) {}

  get(userId: string, id: GenerationId) {
    return this.generationRepo.findById(userId, id)
  }

  create(userId: string, value: unknown, id?: string) {
    return this.generationRepo.create(
      userId,
      Generation.create({
        ...(value as Parameters<typeof Generation.create>[0]),
        ...(id ? { externalId: id as UUID } : {}),
      }),
    )
  }

  async patch(userId: string, id: GenerationId, value: { revision: number }) {
    const current = await this.get(userId, id)
    if (!current) throw new ResourceNotFoundError('generation')
    return this.generationRepo.update(userId, current.update(value))
  }

  delete(userId: string, id: GenerationId, revision?: number) {
    return this.generationRepo.delete(userId, id, revision)
  }

  async getGenerations(userId: string): Promise<IGenerationRecord[]> {
    const records = await this.generationRepo.findAll(userId)
    return records
      .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))
      .map((record) => record.toSnapshot())
  }

  async getLatestGeneration(
    userId: string,
  ): Promise<IGenerationResult | undefined> {
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
    meta: IGenerationMeta,
    schedules: IBaseScheduleGenerate[],
    occurrences: IIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult> {
    const schedulesToSave = schedules.map((schedule) =>
      Schedule.create(schedule),
    )
    const savedSchedules = await this.schedulesRepo.createAll(
      userId,
      schedulesToSave,
    )

    let savedRecord: Generation
    try {
      const record: IBaseGenerationRecord = {
        resultCount: schedules.length,
        occurrences,
        ...meta,
        scheduleIds: savedSchedules.map((schedule) => schedule.id),
      }

      savedRecord = await this.generationRepo.create(
        userId,
        Generation.create(record),
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
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]> {
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
