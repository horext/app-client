import type { InjectionKey } from 'vue'
import type { $Fetch } from 'ofetch'
import type { ApiRegistry } from './registry'

export const FETCH_KEY: InjectionKey<$Fetch> = Symbol('FetchApi')
export const API_REGISTRY_KEY: InjectionKey<ApiRegistry> = Symbol('ApiRegistry')
