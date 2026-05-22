import type { UUID } from 'node:crypto'
import type { IEvent } from '../../shared/interfaces/event'
import type {
  IScheduleGenerate,
  IScheduleSubjectGenerate,
} from '../../shared/interfaces/schedule'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'
import { StoresDB } from '../context/db'

interface IMySchedule {
  id: string
  scheduleSubjectIds: number[]
  schedule: IScheduleSubjectGenerate[]
  crossings: number
  events: IEvent[]
}

function transformSchedule(s: IMySchedule): IScheduleGenerate {
  return {
    id: crypto.randomUUID(),
    scheduleSubjectIds: s.scheduleSubjectIds,
    scheduleSubjectKey: s.id,
    schedules: s.schedule,
    crossings: s.crossings,
    events: s.events,
  }
}

async function up({ db }: MigrationContext) {
  const rawSchedules =
    readLsJson<IMySchedule[]>('mySchedules')?.map<IScheduleGenerate>((s) =>
      transformSchedule(s),
    ) ?? []
  const rawFavorites =
    readLsJson<IMySchedule[]>('myFavoritesSchedules')?.map<IScheduleGenerate>(
      (s) => transformSchedule(s),
    ) ?? []

  const allById = new Map<UUID, IScheduleGenerate>()
  for (const s of [...rawSchedules, ...rawFavorites]) {
    allById.set(s.id, s)
  }

  if (allById.size > 0) {
    const tx = db.transaction(
      [StoresDB.SCHEDULES, StoresDB.FAVORITES],
      'readwrite',
    )
    await Promise.all(
      [...allById.values()].map((s) =>
        tx.objectStore(StoresDB.SCHEDULES).put(s),
      ),
    )
    await Promise.all(
      rawFavorites.map((s) =>
        tx.objectStore(StoresDB.FAVORITES).put({ id: s.id }),
      ),
    )
    await tx.done
  }

  if (rawSchedules.length > 0) {
    await db.put(StoresDB.GENERATIONS, {
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

export default { id: 'v4_localstorage_schedules_to_indexeddb', up } satisfies Migration
