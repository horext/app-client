import type { UUID } from 'node:crypto'
import type { Weekdays } from '../../shared/interfaces/event'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'
import { StoresDB } from '../context/db'

interface IMyEvent {
  id: UUID
  day: Weekdays
  startTime: string
  endTime: string
  title: string
  description: string
  location: string
  color: string
  type: string
}

async function up({ db }: MigrationContext) {
  const rawEvents = readLsJson<IMyEvent[]>('myEvents') ?? []
  if (rawEvents.length === 0) return

  const tx = db.transaction(StoresDB.ACTIVITIES, 'readwrite')
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
