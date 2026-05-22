import type { IScheduleGenerate } from '../../shared/interfaces/schedule'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

async function up({ db }: MigrationContext) {
  const rawSchedules = readLsJson<IScheduleGenerate[]>('mySchedules') ?? []
  const rawFavorites =
    readLsJson<IScheduleGenerate[]>('myFavoritesSchedules') ?? []

  const allById = new Map<string, IScheduleGenerate>()
  for (const s of [...rawSchedules, ...rawFavorites]) allById.set(s.id, s)

  if (allById.size > 0) {
    const tx = db.transaction(['schedules', 'favorites'], 'readwrite')
    await Promise.all(
      [...allById.values()].map((s) => tx.objectStore('schedules').put(s)),
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
