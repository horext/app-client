import type { Migration } from './types'
import v1 from './v1_localstorage_to_indexeddb'
import v2 from './v2_localstorage_events_to_indexeddb'

export const migrations: Migration[] = [v1, v2]
