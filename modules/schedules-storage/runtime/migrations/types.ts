import type { IDBPDatabase } from 'idb'
import type { HorextDB } from '../db'

export type MigrationContext = {
  db: IDBPDatabase<HorextDB>
}

export type Migration = {
  id: string
  up: (ctx: MigrationContext) => Promise<void>
}
