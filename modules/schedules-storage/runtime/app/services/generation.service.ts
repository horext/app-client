import type {
  IBaseGenerationRecord,
  IGenerationMeta,
  IGenerationRecord,
  IGenerationResult,
} from '../../shared/interfaces/generation-record'
import type { IIntersectionOccurrence } from '../../shared/interfaces/ocurrences'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../../shared/interfaces/schedule'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import type { IGenerationService } from './generation.service.interface'
import type {
  ISchedulesFavoritesRepository,
  ISchedulesRepository,
} from '../repositories/schedules-repository.interface'

export class GenerationService implements IGenerationService {
  constructor(
    private readonly generationRepo: IGenerationRepository,
    private readonly schedulesRepo: ISchedulesRepository,
    private readonly favoritesRepo: ISchedulesFavoritesRepository,
  ) {}

  async getGenerations(): Promise<IGenerationRecord[]> {
    const records = await this.generationRepo.getAll()
    return records.sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))
  }

  async getLatestGeneration(): Promise<IGenerationResult | undefined> {
    const records = await this.getGenerations()
    const latest = records[records.length - 1]
    if (!latest) return undefined
    const schedules = await this.schedulesRepo.getEntries(latest.scheduleIds)
    return { ...latest, schedules }
  }

  async saveGeneration(
    meta: IGenerationMeta,
    schedules: IBaseScheduleGenerate[],
    occurrences: IIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult> {
    const savedSchedules = await this.schedulesRepo.saveAll(schedules)

    const record: IBaseGenerationRecord = {
      resultCount: schedules.length,
      occurrences,
      ...meta,
      scheduleIds: savedSchedules.map((s) => s.id),
    }

    const savedRecord = await this.generationRepo.create(record)

    // 3. Trim history and clean orphaned schedules
    await this._trimAndCleanup(maxHistory)

    return { ...savedRecord, schedules: savedSchedules, occurrences }
  }

  async getSchedulesForGeneration(
    record: IGenerationRecord,
  ): Promise<IScheduleGenerate[]> {
    return this.schedulesRepo.getEntries(record.scheduleIds)
  }

  private async _trimAndCleanup(maxHistory: number): Promise<void> {
    const records = await this.getGenerations()
    if (records.length <= maxHistory) return

    // Oldest records to remove
    const toRemove = records.slice(0, records.length - maxHistory)

    for (const r of toRemove) {
      await this.generationRepo.delete(r.id)
    }

    // Compute which schedule IDs are still referenced
    const remaining = records.slice(records.length - maxHistory)
    const referencedIds = new Set(remaining.flatMap((r) => r.scheduleIds))

    // Also keep favorites
    const favoriteIds = await this.favoritesRepo.getIds()
    for (const id of favoriteIds) referencedIds.add(id)

    // Collect all orphaned schedule IDs from removed records
    const orphanIds = toRemove
      .flatMap((r) => r.scheduleIds)
      .filter((id) => !referencedIds.has(id))

    if (orphanIds.length > 0) {
      await this.schedulesRepo.deleteEntries(orphanIds)
    }
  }
}
