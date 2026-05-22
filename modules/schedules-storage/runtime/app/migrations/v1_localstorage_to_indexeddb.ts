import type { UUID } from 'crypto'
import type { IEvent } from '../../shared/interfaces/event'
import type { IScheduleSubjectGenerate } from '../../shared/interfaces/schedule'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

interface IMySchedule {
  id: UUID
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

async function up({ db }: MigrationContext) {
  const rawSchedules = readLsJson<IMySchedule[]>('mySchedules') ?? []
  const rawFavorites =
    readLsJson<IMySchedule[]>('myFavoritesSchedules') ?? []

  const allById = new Map<string, IMySchedule>()
  for (const s of [...rawSchedules, ...rawFavorites]) allById.set(s.id, s)

  if (allById.size > 0) {
    const tx = db.transaction(['schedules', 'favorites'], 'readwrite')
    await Promise.all(
      [...allById.values()].map((s) => tx.objectStore('schedules').put(
        {
          id: s.id,
          scheduleSubjectIds: s.scheduleSubjectIds,
          scheduleSubjectKey: s.scheduleSubjectIds.join(','),
          schedules: s.schedule,
          crossings: s.crossings,
          events: s.events,
        },
      )),
    )
    await Promise.all(
      rawFavorites.map((s) => tx.objectStore('favorites').put({ id: s.id })),
    )
    await tx.done
  }

  if (rawSchedules.length > 0) {
    await db.put('generations', {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      scheduleIds: rawSchedules.map((s) => s.id),
      crossingsSetting: 0,
      weekDays: [0, 1, 2, 3, 4, 5, 6],
      hourlyLoadId: 0,
      resultCount: rawSchedules.length,
      occurrences: [],
    })
  }
}

export default { id: 'v1_localstorage_to_indexeddb', up } satisfies Migration
