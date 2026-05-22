import type { ISubjectSchedule } from '../../shared/interfaces/subject'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

async function up({ db }: MigrationContext) {
  const subjects = readLsJson<{
    id: number
    course: {
      id: string
      name: string
    }
    type: {
      id: number
      name: string
      code: string
    }
    studyPlan: {
      id: number
      fromDate: string
      code: string
      organizationUnit: {
        id: number
      }
    }
    credits: number
    cycle:  number | null
    schedules: ISubjectSchedule[]
  }[]>('mySubjects') ?? []
  const valid = subjects.filter((s) => s?.schedules?.length > 0)

  if (valid.length > 0) {
    const tx = db.transaction('subjects', 'readwrite')
    await Promise.all(valid.map((s) => tx.store.put({
      id: crypto.randomUUID(),
      schedules: s.schedules,
      subject: {
        id: s.id,
        course: s.course,
        type: s.type,
        studyPlan: s.studyPlan,
        credits: s.credits,
        cycle: s.cycle,
      }
    })))
    await tx.done
  }
}

export default {
  id: 'v5_localstorage_subjects_to_indexeddb',
  up,
} satisfies Migration
