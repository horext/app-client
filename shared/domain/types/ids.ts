import type { UUID } from 'crypto'

export declare const brand: unique symbol
export type Brand<T, TBrand extends string> = T & { readonly [brand]: TBrand }

export type BrandUUID<TBrand extends string> = Brand<UUID, TBrand>

export const makeUUID = <T extends Brand<UUID, string>>(): T => {
  return crypto.randomUUID() as T
}
