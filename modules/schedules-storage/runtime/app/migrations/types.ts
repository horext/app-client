import type { IDBPDatabase } from 'idb'
import type { HorextDB } from '../context/db'

export type MigrationContext = {
  db: IDBPDatabase<HorextDB>
}

export type Migration = {
  id: string
  up: (ctx: MigrationContext) => Promise<void>
}
