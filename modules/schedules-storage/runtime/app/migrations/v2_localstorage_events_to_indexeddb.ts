import type { UUID } from 'node:crypto'
import type { IBaseEvent } from '../../shared/interfaces/event'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

async function up({ db }: MigrationContext) {
  const rawEvents =
    readLsJson<Array<IBaseEvent & { id: UUID }>>('myEvents') ?? []
  if (rawEvents.length === 0) return

  const tx = db.transaction('activities', 'readwrite')
  await Promise.all(
    rawEvents.map((e) =>
      tx.store.put({
        ...e,
        category: 'MY_EVENT',
        type: 'MY_EVENT',
      }),
    ),
  )
  await tx.done
}

export default {
  id: 'v2_localstorage_events_to_indexeddb',
  up,
} satisfies Migration
