import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { Migration, MigrationContext } from './types'
import { readCookieJson } from './utils'

async function up({ db }: MigrationContext) {
  const generatedRecords = await db.getAll('generated')
  if (generatedRecords.length === 0) return

  const preferences = await db.get('preferences', 'preferences')
  const hourlyLoad = readCookieJson<IHourlyLoad>('myHourlyLoad')

  await db.put('generations', {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    scheduleIds: generatedRecords.map((r) => r.id),
    crossingsSetting: preferences?.crossings ?? 0,
    weekDays: preferences?.weekDays ?? [0, 1, 2, 3, 4, 5, 6],
    hourlyLoadId: hourlyLoad?.id ?? 0,
    resultCount: generatedRecords.length,
  })
}

export default { id: 'v5_generated_to_generations', up } satisfies Migration
