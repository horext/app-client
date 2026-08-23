// modules/apis/runtime/testing/test-api.plugin.ts
import type { App, InjectionKey, Plugin } from 'vue'
import { ApiRegistry } from '../core/registry'
import { API_REGISTRY_KEY } from '../core/symbols'

type ApiEntry<T = unknown> = [InjectionKey<T>, T]

interface TestApiPluginOptions {
  mocks?: ApiEntry[]
}

export function createTestApiPlugin(
  options: TestApiPluginOptions = {},
): Plugin {
  const { mocks = [] } = options

  return {
    install(app: App) {
      // 1. Creamos y proveemos el registro de pruebas aislado
      const registry = new ApiRegistry()

      // Rellenamos el registro con los mocks tipados
      for (const [key, mockInstance] of mocks) {
        registry.set(key, mockInstance)
      }

      app.provide(API_REGISTRY_KEY, registry)
    },
  }
}
