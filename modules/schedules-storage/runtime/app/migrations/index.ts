import type { Migration } from './types'
import v1 from './v1_localstorage_to_indexeddb'
import v2 from './v2_localstorage_events_to_indexeddb'
import v3 from './v3_localstorage_config_to_indexeddb'
import v4 from './v4_cookies_to_profile'
import v5 from './v5_localstorage_subjects_to_indexeddb'

export const migrations: Migration[] = [v1, v2, v3, v4, v5]
