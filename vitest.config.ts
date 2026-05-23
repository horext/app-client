import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    benchmark: {
      outputJson: '.bench/results.json',
      compare: '.bench/baseline.json',
    },
  },
})
