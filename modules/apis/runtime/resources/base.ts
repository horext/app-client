import type { $Fetch } from 'nitropack'

export abstract class BaseApi {
  constructor(protected $fetch: $Fetch) {}
}
