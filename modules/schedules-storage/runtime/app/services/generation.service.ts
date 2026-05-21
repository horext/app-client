import type { IGenerationMeta, IGenerationRecord, IGenerationResult } from '~/interfaces/generation-record'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import type { IGenerationService } from './generation.service.interface'
import type { ISchedulesFavoritesRepository, ISchedulesRepository } from '../repositories/schedules-repository.interface'

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
    schedules: IScheduleGenerate[],
    occurrences: IIntersectionOccurrence[],
    maxHistory: number,
  ): Promise<IGenerationResult> {
    const record: IGenerationRecord = {
      id: crypto.randomUUID(),
      scheduleIds: schedules.map((s) => s.id),
      resultCount: schedules.length,
      occurrences,
      ...meta,
    }

    // 1. Persist schedule objects
    await this.schedulesRepo.putEntries(schedules)

    // 2. Persist generation record
    await this.generationRepo.save(record)

    // 3. Trim history and clean orphaned schedules
    await this._trimAndCleanup(maxHistory)

    return { ...record, schedules, occurrences }
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
