import type { Migration } from './types'
import v1 from './v1_localstorage_to_indexeddb'

export const migrations: Migration[] = [v1]
