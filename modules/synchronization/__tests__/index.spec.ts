import { describe, expect, it, vi } from 'vitest'

import synchronizationModule from '../index'

const kit = vi.hoisted(() => ({
  addPlugin: vi.fn(),
  resolve: vi.fn((path: string) => `/resolved/${path}`),
}))

vi.mock('nuxt/kit', () => ({
  addPlugin: kit.addPlugin,
  createResolver: vi.fn(() => ({ resolve: kit.resolve })),
  defineNuxtModule: vi.fn((definition) => definition),
}))

describe('synchronization Nuxt module', () => {
  it('Given module setup, when synchronization is registered, then client and server composition plugins are added', () => {
    synchronizationModule.setup?.({}, { options: {} })
    expect(kit.addPlugin).toHaveBeenCalledTimes(2)
    expect(kit.resolve).toHaveBeenCalledWith('runtime/plugins/provide.client')
    expect(kit.resolve).toHaveBeenCalledWith('runtime/plugins/provide.server')
  })
})
