import type { Fetch } from 'ofetch'

export abstract class BaseApi {
  constructor(protected $fetch: Fetch) {}
}
