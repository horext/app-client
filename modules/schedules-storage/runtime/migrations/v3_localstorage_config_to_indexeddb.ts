import type { Weekdays } from '~/interfaces/event'
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
  const crossings = readLsJson<number>('myCrossings') ?? 0
  const weekDays = readLsJson<Weekdays[]>('myWeekDays') ?? [0, 1, 2, 3, 4, 5, 6]

  await db.put('preferences', {
    id: 'preferences',
    crossings,
    weekDays,
    maxGenerationHistory: 5,
  })
}

export default { id: 'v3_localstorage_config_to_indexeddb', up } satisfies Migration
