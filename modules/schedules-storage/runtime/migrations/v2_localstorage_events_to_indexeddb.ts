import type { IEvent } from '~/interfaces/event'
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
  const rawEvents = readLsJson<Array<IEvent & { id: string }>>('myEvents') ?? []
  if (rawEvents.length === 0) return

  const tx = db.transaction('activities', 'readwrite')
  await Promise.all(rawEvents.map((e) => tx.store.put(e)))
  await tx.done
}

export default { id: 'v2_localstorage_events_to_indexeddb', up } satisfies Migration
