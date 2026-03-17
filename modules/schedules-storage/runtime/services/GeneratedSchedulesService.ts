import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISchedulesRepository } from '../interfaces/schedules-repository'
import type { IGeneratedSchedulesService } from '../interfaces/generated-schedules-service'

export class GeneratedSchedulesService implements IGeneratedSchedulesService {
  constructor(private readonly repo: ISchedulesRepository) {}

  async getGeneratedSchedules(): Promise<IScheduleGenerate[]> {
    const ids = await this.repo.getIds('generated')
    return this.repo.getEntries(ids)
  }

  async saveGeneratedSchedules(schedules: IScheduleGenerate[]): Promise<void> {
    const [oldGeneratedIds, favIds] = await Promise.all([
      this.repo.getIds('generated'),
      this.repo.getIds('favorites'),
    ])

    const newIdSet = new Set(schedules.map((s) => s.id))
    const favIdSet = new Set(favIds)

    const orphans = oldGeneratedIds.filter(
      (id) => !newIdSet.has(id) && !favIdSet.has(id),
    )

    await Promise.all([
      this.repo.deleteEntries(orphans),
      this.repo.putEntries(schedules),
      this.repo.putIds('generated', schedules.map((s) => s.id)),
    ])
  }

  async addGeneratedSchedule(schedule: IScheduleGenerate): Promise<void> {
    const generatedIds = await this.repo.getIds('generated')
    if (!generatedIds.includes(schedule.id)) {
      await Promise.all([
        this.repo.putEntry(schedule),
        this.repo.putIds('generated', [...generatedIds, schedule.id]),
      ])
    }
  }

  async removeGeneratedSchedule(id: string): Promise<void> {
    const [generatedIds, favIds] = await Promise.all([
      this.repo.getIds('generated'),
      this.repo.getIds('favorites'),
    ])
    await this.repo.putIds(
      'generated',
      generatedIds.filter((i) => i !== id),
    )
    if (!favIds.includes(id)) {
      await this.repo.deleteEntry(id)
    }
  }
}
