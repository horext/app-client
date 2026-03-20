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
    const tx = db.transaction(['entries', 'meta'], 'readwrite')
    await Promise.all([...allById.values()].map((s) => tx.objectStore('entries').put(s)))
    await tx.objectStore('meta').put(rawSchedules.map((s) => s.id), 'generated:ids')
    await tx.objectStore('meta').put(rawFavorites.map((s) => s.id), 'favorites:ids')
    await tx.done
  }
}

export default { id: 'v1_localstorage_to_indexeddb', up } satisfies Migration
