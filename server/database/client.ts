import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import { useDatabase } from '../utils/db'
import * as schema from './schema'
import type { H3Event } from 'h3'

export type HorextDatabase = DrizzleD1Database<typeof schema>

export function useOrm(event: H3Event): HorextDatabase {
  return drizzle(useDatabase(event), { schema })
}
