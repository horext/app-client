import { inject } from 'vue'
import { SCHEDULES_DB_KEY, StoresDB } from '../app/context/db'
import { migrations } from '../app/migrations'
import type { MigrationContext } from '../app/migrations/types'

export default defineNuxtPlugin({
  name: 'schedules-storage:migration',
  dependsOn: ['schedules-storage:provide-repos'],
  async setup() {
    const getDb = inject(SCHEDULES_DB_KEY)!
    const db = await getDb()

    const ctx: MigrationContext = { db }

    const allRecords = await db.getAll(StoresDB.MIGRATIONS)
    const successfulIds = new Set(
      allRecords.filter((r) => !r.error).map((r) => r.id),
    )
    const pending = migrations
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
      .filter((m) => !successfulIds.has(m.id))

    for (const migration of pending) {
      try {
        await migration.up(ctx)
        await db.put(StoresDB.MIGRATIONS, {
          id: migration.id,
          appliedAt: new Date().toISOString(),
        })
      } catch (error) {
        await db.put(StoresDB.MIGRATIONS, {
          id: migration.id,
          appliedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        })
        break
      }
    }
  },
})
