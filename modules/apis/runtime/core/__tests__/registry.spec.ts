import { describe, it, expect } from 'vitest'
import { defineComponent, provide, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { InjectionKey } from 'vue'
import { ApiRegistry, useApiRegistry } from '../registry'
import { API_REGISTRY_KEY } from '../symbols'

describe('ApiRegistry Core', () => {
  it('should store and retrieve instances typed correctly', () => {
    const registry = new ApiRegistry()
    const TEST_KEY: InjectionKey<{ name: string }> = Symbol('TestKey')

    registry.set(TEST_KEY, { name: 'Vitest' })

    expect(registry.get(TEST_KEY)).toEqual({ name: 'Vitest' })
    expect(registry.has(TEST_KEY)).toBe(true)
  })

  it('useApiRegistry should throw if registry is not provided in context', () => {
    const TestComponent = defineComponent({
      setup() {
        useApiRegistry()
        return () => null
      },
    })

    expect(() => mount(TestComponent)).toThrowError(/ApiRegistry not provided/)
  })

  it('useApiRegistry should return the registry when provided in Vue context', () => {
    const registry = new ApiRegistry()
    let injectedRegistry: ApiRegistry | undefined

    const ChildComponent = defineComponent({
      setup() {
        injectedRegistry = useApiRegistry()
        return () => null
      },
    })

    const ParentComponent = defineComponent({
      setup() {
        provide(API_REGISTRY_KEY, registry)
        return () => h(ChildComponent)
      },
    })

    mount(ParentComponent)
    expect(injectedRegistry).toBe(registry)
  })
})
