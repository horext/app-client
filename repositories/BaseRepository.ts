import type { $Fetch } from 'nitropack'

export abstract class BaseRepository {
  constructor(protected $fetch: $Fetch) {}
}
