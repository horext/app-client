import type { BaseApi } from '../resources/base'

export type ApiFactory<C extends BaseApi = BaseApi> = new (
  ...args: ConstructorParameters<typeof BaseApi>
) => C
