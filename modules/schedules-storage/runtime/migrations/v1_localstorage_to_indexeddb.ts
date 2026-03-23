import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { Migration, MigrationContext } from './types'

function readLsJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

async function up({ db }: MigrationContext) {
  const rawSchedules = readLsJson<IScheduleGenerate[]>('mySchedules') ?? []
  const rawFavorites = readLsJson<IScheduleGenerate[]>('myFavoritesSchedules') ?? []

  const allById = new Map<string, IScheduleGenerate>()
  for (const s of [...rawSchedules, ...rawFavorites]) allById.set(s.id, s)

  if (allById.size > 0) {
    const tx = db.transaction(['schedules', 'generated', 'favorites'], 'readwrite')
    await Promise.all([...allById.values()].map((s) => tx.objectStore('schedules').put(s)))
    await Promise.all(rawSchedules.map((s) => tx.objectStore('generated').put({ id: s.id })))
    await Promise.all(rawFavorites.map((s) => tx.objectStore('favorites').put({ id: s.id })))
    await tx.done
  }
}

export default { id: 'v1_localstorage_to_indexeddb', up } satisfies Migration
