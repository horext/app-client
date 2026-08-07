import type { DisplayThresholds } from 'vuetify'

const thresholds: DisplayThresholds = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}

export const forVuetify = thresholds

export const forUnoCSS = Object.entries(thresholds).reduce(
  (accumulator, [key, value]) => ({
    ...accumulator,
    [key]: `${value}px`,
  }),
  {} as Record<keyof DisplayThresholds, string>,
)
