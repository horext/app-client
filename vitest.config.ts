import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import path from 'path'

const include = [
  'app/**/__tests__/**/*.{spec,test}.ts',
  'modules/**/__tests__/**/*.{spec,test}.ts',
]

export default defineConfig({
  test: {
    projects: [
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
          include,
          environment: 'nuxt',
          includeSource: ['app/**/*.{ts,vue}', 'modules/**/*.{ts,vue}'],
          benchmark: {
            include: [],
          },
        },
      }),
    ],
  },
})
