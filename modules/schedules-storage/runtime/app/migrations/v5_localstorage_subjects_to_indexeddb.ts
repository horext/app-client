import type { Weekdays } from '../../shared/interfaces/event'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

export interface MySubject {
  course: {
    id: string
    name: string
  }
  credits: number
  cycle: number
  id: number
  studyPlan: {
    code: string
    fromDate: string
    id: number
    organizationUnit: {
      id: number
    }
    toDate: null
  }
  type: {
    code: string
    id: number
    name: string
  }
  schedules: {
    deleteAt: null
    id: number
    section: {
      id: string
    }
    sessions: {
      id: number
      schedule: {
        deleteAt: null
        id: number
        section: null
        sessions: null
      }
      type: {
        code: string
        id: number
        name: string
      }
      classroom: {
        code: string
        id: number
        name: null
      }
      teacher: {
        code: null
        fullName: string
        id: number
      }
      day: Weekdays
      startTime: string
      endTime: string
    }[]
    scheduleSubject: {
      id: number
    }
  }[]
}

async function up({ db }: MigrationContext) {
  const subjects = readLsJson<MySubject[]>('mySubjects') ?? []
  const valid = subjects.filter((s) => s?.schedules?.length > 0)

  if (valid.length > 0) {
    const tx = db.transaction('subjects', 'readwrite')
    await Promise.all(
      valid.map((s) =>
        tx.store.put({
          id: crypto.randomUUID(),
          schedules: s.schedules,
          subject: {
            id: s.id,
            course: s.course,
            type: s.type,
            studyPlan: s.studyPlan,
            credits: s.credits,
            cycle: s.cycle,
          },
        }),
      ),
    )
    await tx.done
  }
}

export default {
  id: 'v5_localstorage_subjects_to_indexeddb',
  up,
} satisfies Migration
