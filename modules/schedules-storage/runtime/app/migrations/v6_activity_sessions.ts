import { StoresDB } from '../context/db'
import type { Migration, MigrationContext } from './types'
import type {
  IActivity,
  IActivitySession,
  Weekdays,
} from '../../shared/interfaces/event'

type LegacyActivity = Omit<IActivity, 'sessions'> & {
  day: Weekdays
  startTime: string
  endTime: string
  sessions?: IActivitySession[]
}

async function up({ db }: MigrationContext) {
  const tx = db.transaction(StoresDB.ACTIVITIES, 'readwrite')
  const activities = (await tx.store.getAll()) as Array<
    IActivity | LegacyActivity
  >

  await Promise.all(
    activities
      .filter((activity) => !activity.sessions?.length)
      .map((activity) => {
        const legacy = activity as LegacyActivity
        const { day, startTime, endTime, ...base } = legacy
        return tx.store.put({
          ...base,
          sessions: [
            {
              day,
              startTime,
              endTime,
            },
          ],
        })
      }),
  )

  await tx.done
}

export default {
  id: 'v6_activity_sessions',
  up,
} satisfies Migration
