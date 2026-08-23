// modules/apis/runtime/factories/define-api.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, provide, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { InjectionKey } from 'vue'
import { defineApi } from '../define-api'
import { ApiRegistry } from '../registry'
import { API_REGISTRY_KEY } from '../symbols'

describe('defineApi Factory', () => {
  it('should instantiate the API only once per Vue app (Lazy Loading)', () => {
    const mockFactory = vi.fn(() => ({ randomValue: Math.random() }))
    const TEST_API_KEY: InjectionKey<{ randomValue: number }> =
      Symbol('TestApi')
    const useTestApi = defineApi(TEST_API_KEY, mockFactory)

    let instance1, instance2

    const ChildComponent = defineComponent({
      setup() {
        instance1 = useTestApi()
        instance2 = useTestApi()
        return () => null
      },
    })

    const ParentComponent = defineComponent({
      setup() {
        provide(API_REGISTRY_KEY, new ApiRegistry())
        return () => h(ChildComponent)
      },
    })

    mount(ParentComponent)

    expect(mockFactory).toHaveBeenCalledTimes(1)
    expect(instance1).toBe(instance2)
  })

  it('should isolate APIs between different Vue apps (SSR Safety)', () => {
    const factory = () => ({ id: Math.random() })
    const TEST_API_KEY: InjectionKey<{ id: number }> = Symbol('TestApi')
    const useTestApi = defineApi(TEST_API_KEY, factory)

    let app1Instance, app2Instance

    const Child1 = defineComponent({
      setup() {
        app1Instance = useTestApi()
        return () => null
      },
    })

    const App1 = defineComponent({
      setup() {
        provide(API_REGISTRY_KEY, new ApiRegistry())
        return () => h(Child1)
      },
    })

    const Child2 = defineComponent({
      setup() {
        app2Instance = useTestApi()
        return () => null
      },
    })

    const App2 = defineComponent({
      setup() {
        provide(API_REGISTRY_KEY, new ApiRegistry())
        return () => h(Child2)
      },
    })

    mount(App1)
    mount(App2)

    expect(app1Instance).toBeDefined()
    expect(app2Instance).toBeDefined()
    expect(app1Instance).not.toBe(app2Instance)
    expect(app1Instance?.['id']).not.toEqual(app2Instance?.['id'])
  })
})
