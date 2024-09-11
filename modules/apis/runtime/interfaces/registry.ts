import type { BaseApi } from '../resources/base'

export type ApiFactory<C extends BaseApi = BaseApi> = new (
  ...args: ConstructorParameters<typeof BaseApi>
) => C

export interface IRegistryItem<T = unknown, I extends BaseApi & T = BaseApi & T> {
  provide: InjectionKey<T>
  use: ApiFactory<I>
}