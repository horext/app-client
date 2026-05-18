import type { IScheduleGenerate, UUID } from '~/interfaces/schedule'
import type { IGenerationRecord } from '~/interfaces/generation-record'
import type { ISchedulesRepository } from '../repositories/schedules-repository.interface'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import type { IGeneratedSchedulesService } from './generated-schedules.service.interface'

export class GeneratedSchedulesService implements IGeneratedSchedulesService {
  constructor(
    private readonly generationRepo: IGenerationRepository,
    private readonly schedulesRepo: ISchedulesRepository,
  ) {}

  private async _latestGeneration(): Promise<IGenerationRecord | undefined> {
    const records = await this.generationRepo.getAll()
    return records
      .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))
      .at(-1)
  }

  async getGeneratedSchedules(): Promise<IScheduleGenerate[]> {
    const latest = await this._latestGeneration()
    if (!latest) return []
    return this.schedulesRepo.getEntries(latest.scheduleIds)
  }

  async addGeneratedSchedule(schedule: IScheduleGenerate): Promise<void> {
    const latest = await this._latestGeneration()
    if (!latest || latest.scheduleIds.includes(schedule.id as UUID)) return
    await this.schedulesRepo.putEntry(schedule)
    await this.generationRepo.save({
      ...latest,
      scheduleIds: [...latest.scheduleIds, schedule.id as UUID],
      resultCount: latest.resultCount + 1,
    })
  }

  async removeGeneratedSchedule(id: IScheduleGenerate['id']): Promise<void> {
    const latest = await this._latestGeneration()
    if (!latest) return
    await this.generationRepo.save({
      ...latest,
      scheduleIds: latest.scheduleIds.filter((sid) => sid !== id),
      resultCount: latest.resultCount - 1,
    })
    const [inFav, allRecords] = await Promise.all([
      this.schedulesRepo.isInList('favorites', id),
      this.generationRepo.getAll(),
    ])
    const stillReferenced = allRecords.some(
      (r) => r.id !== latest.id && r.scheduleIds.includes(id as UUID),
    )
    if (!inFav && !stillReferenced) {
      await this.schedulesRepo.deleteEntry(id)
    }
  }
}
