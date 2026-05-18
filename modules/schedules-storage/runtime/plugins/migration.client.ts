import { inject } from 'vue'
import { SCHEDULES_DB_KEY } from '../db'
import { migrations } from '../migrations/index'
import type { MigrationContext } from '../migrations/types'

export default defineNuxtPlugin({
  name: 'schedules-storage:migration',
  dependsOn: ['schedules-storage:provide'],
  async setup() {
    const getDb = inject(SCHEDULES_DB_KEY)!
    const db = await getDb()

    const ctx: MigrationContext = { db }

    const appliedIds = await db.getAllKeys('migrations')
    const pending = migrations.filter((m) => !appliedIds.includes(m.id))

    for (const migration of pending) {
      await migration.up(ctx)
      await db.put('migrations', { id: migration.id, appliedAt: new Date().toISOString() })
    }
  },
})
