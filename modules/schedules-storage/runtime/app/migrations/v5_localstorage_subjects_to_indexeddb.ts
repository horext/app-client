import type { ISelectedSubject } from '../../shared/interfaces/subject'
import type { Migration, MigrationContext } from './types'
import { readLsJson } from './utils'

async function up({ db }: MigrationContext) {
  const subjects = readLsJson<ISelectedSubject[]>('mySubjects') ?? []
  const valid = subjects.filter((s) => s?.schedules?.length > 0)

  if (valid.length > 0) {
    const tx = db.transaction('subjects', 'readwrite')
    await Promise.all(valid.map((s) => tx.store.put(s)))
    await tx.done
  }
}

export default {
  id: 'v5_localstorage_subjects_to_indexeddb',
  up,
} satisfies Migration
