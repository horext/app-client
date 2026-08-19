import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{ts,vue}', 'modules/**/*.{ts,vue}'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['modules/**/__tests__/**/*.{spec,test}.{ts,vue}'],
          environment: 'happy-dom',
          typecheck: {
            enabled: true,
            checker: 'vue-tsc',
          },
          benchmark: {
            include: [],
          },
        },
        resolve: {
          alias: {
            '~': path.resolve(import.meta.dirname, './app'),
            '~~': path.resolve(import.meta.dirname, './'),
            '#shared': path.resolve(import.meta.dirname, './shared'),
          },
        },
        plugins: [vue()],
      },
      {
        test: {
          name: 'bench',
          include: [],
          environment: 'node',
          fileParallelism: false,
          benchmark: {
            include: ['app/**/__tests__/**/*.bench.ts'],
          },
          isolate: true,
        },
        resolve: {
          alias: {
            '~': path.resolve(import.meta.dirname, './app'),
            '#shared': path.resolve(import.meta.dirname, './shared'),
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['app/**/__tests__/**/*.{spec,test}.{ts,vue}'],
          setupFiles: ['./tests/setup/environment.ts'],
          environment: 'nuxt',
          typecheck: {
            enabled: true,
            checker: 'vue-tsc',
          },
          benchmark: {
            include: [],
          },
        },
      }),
    ],
  },
})
