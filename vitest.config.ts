import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['modules/**/__tests__/**/*.{spec,test}.ts'],
          environment: 'happy-dom',
          benchmark: {
            include: [],
          },
        },
        resolve: {
          alias: {
            '~': path.resolve(__dirname, './app'),
          },
        },
        plugins: [vue()],
      },
      {
        test: {
          name: 'bench',
          include: [],
          environment: 'node',
          benchmark: {
            include: ['app/**/__tests__/**/*.bench.ts'],
            outputJson: '.bench/results.json',
            compare: '.bench/baseline.json',
          },
        },
        resolve: {
          alias: {
            '~': path.resolve(__dirname, './app'),
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['app/**/__tests__/**/*.{spec,test}.ts'],
          environment: 'nuxt',
          benchmark: {
            include: [],
          },
        },
      }),
    ],
  },
})
