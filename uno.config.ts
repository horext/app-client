import { defineConfig, presetWind4, transformerDirectives } from 'unocss'
import { forUnoCSS } from './modules/vuetify/runtime/breakpoints'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: false,
      },
      dark: {
        dark: '.v-theme--dark',
        light: '.v-theme--light',
      },
    }),
  ],
  transformers: [transformerDirectives()],
  outputToCssLayers: {
    cssLayerName: (layer) => (layer === 'properties' ? null : `uno-${layer}`),
  },
  content: {
    filesystem: [
      'pages/**/*.vue',
      'components/**/*.vue',
      'layouts/**/*.vue',
      'app.vue',
    ],
  },
  safelist: [
    ...Array.from({ length: 6 }, (_, index) => `elevation-${index}`),
    'rounded-0',
    'rounded-sm',
    'rounded',
    'rounded-lg',
    'rounded-xl',
    'rounded-full',
    'rounded-pill',
    'rounded-circle',
    'rounded-shaped',
    'bg-primary',
    'text-primary',
    'bg-success',
    'text-success',
    'bg-error',
    'text-error',
    'bg-warning',
    'text-warning',
    'bg-info',
    'text-info',
    'bg-secondary',
    'text-secondary',
  ],
  shortcuts: {
    'text-h1': 'text-[6rem] font-[300] leading-[1] tracking-[-.015625em]',
    'text-h2':
      'text-[3.75rem] font-[300] leading-[1] tracking-[-.0083333333em]',
    'text-h3': 'text-[3rem] font-[400] leading-[1.05] tracking-[normal]',
    'text-h4':
      'text-[2.125rem] font-[400] leading-[1.175] tracking-[.0073529412em]',
    'text-h5': 'text-[1.5rem] font-[400] leading-[1.333] tracking-[normal]',
    'text-h6': 'text-[1.25rem] font-[500] leading-[1.6] tracking-[.0125em]',
    'text-subtitle-1':
      'text-[1rem] font-[400] leading-[1.75] tracking-[.009375em]',
    'text-subtitle-2':
      'text-[.875rem] font-[500] leading-[1.6] tracking-[.0071428571em]',
    'text-body-1': 'text-[1rem] font-[400] leading-[1.5] tracking-[.03125em]',
    'text-body-2':
      'text-[.875rem] font-[400] leading-[1.425] tracking-[.0178571429em]',
    'text-caption':
      'text-[.75rem] font-[400] leading-[1.667] tracking-[.0333333333em]',
    'text-overline':
      'text-[.75rem] font-[500] leading-[2.667] tracking-[.1666666667em] uppercase',
    'text-display-large':
      'text-[3.5625rem] font-[400] leading-[1.1228] tracking-[-.0044em]',
    'text-display-medium':
      'text-[2.8125rem] font-[400] leading-[1.1556] tracking-[normal]',
    'text-display-small':
      'text-[2.25rem] font-[400] leading-[1.2222] tracking-[normal]',
    'text-headline-large':
      'text-[2rem] font-[400] leading-[1.25] tracking-[normal]',
    'text-headline-medium':
      'text-[1.75rem] font-[400] leading-[1.2857] tracking-[normal]',
    'text-headline-small':
      'text-[1.5rem] font-[400] leading-[1.3333] tracking-[normal]',
    'text-title-large':
      'text-[1.375rem] font-[400] leading-[1.2727] tracking-[normal]',
    'text-title-medium':
      'text-[1rem] font-[500] leading-[1.5] tracking-[.0094em]',
    'text-title-small':
      'text-[.875rem] font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-body-large':
      'text-[1rem] font-[400] leading-[1.5] tracking-[.0313em]',
    'text-body-medium':
      'text-[.875rem] font-[400] leading-[1.4286] tracking-[.0179em]',
    'text-body-small':
      'text-[.75rem] font-[400] leading-[1.3333] tracking-[.0333em]',
    'text-label-large':
      'text-[.875rem] font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-label-medium':
      'text-[.75rem] font-[500] leading-[1.3333] tracking-[.0417em]',
    'text-label-small':
      'text-[.6875rem] font-[500] leading-[1.4545] tracking-[.0455em]',
    'bg-hero-overlay':
      'bg-[linear-gradient(to_bottom,rgba(10,25,60,0.88),rgba(20,45,110,0.78))]',
    'rounded-0': 'rounded-none',
    'rounded-sm': 'rounded-[2px]',
    rounded: 'rounded-[4px]',
    'rounded-lg': 'rounded-[8px]',
    'rounded-xl': 'rounded-[24px]',
    'rounded-pill': 'rounded-full',
    'rounded-circle': 'rounded-[50%]',
    'rounded-shaped': 'rounded-[24px_0]',
    'rounded-t-0': 'rounded-t-none',
    'rounded-t-sm': 'rounded-tl-[2px] rounded-tr-[2px]',
    'rounded-t': 'rounded-tl-[4px] rounded-tr-[4px]',
    'rounded-t-lg': 'rounded-tl-[8px] rounded-tr-[8px]',
    'rounded-t-xl': 'rounded-tl-[24px] rounded-tr-[24px]',
    'rounded-t-pill': 'rounded-tl-full rounded-tr-full',
    'rounded-b-0': 'rounded-b-none',
    'rounded-b-sm': 'rounded-bl-[2px] rounded-br-[2px]',
    'rounded-b': 'rounded-bl-[4px] rounded-br-[4px]',
    'rounded-b-lg': 'rounded-bl-[8px] rounded-br-[8px]',
    'rounded-b-xl': 'rounded-bl-[24px] rounded-br-[24px]',
    'rounded-b-pill': 'rounded-bl-full rounded-br-full',
    'rounded-s-0': 'rounded-ss-none rounded-es-none',
    'rounded-s-sm': 'rounded-ss-[2px] rounded-es-[2px]',
    'rounded-s': 'rounded-ss-[4px] rounded-es-[4px]',
    'rounded-s-lg': 'rounded-ss-[8px] rounded-es-[8px]',
    'rounded-s-xl': 'rounded-ss-[24px] rounded-es-[24px]',
    'rounded-s-pill': 'rounded-ss-full rounded-es-full',
    'rounded-e-0': 'rounded-se-none rounded-ee-none',
    'rounded-e-sm': 'rounded-se-[2px] rounded-ee-[2px]',
    'rounded-e': 'rounded-se-[4px] rounded-ee-[4px]',
    'rounded-e-lg': 'rounded-se-[8px] rounded-ee-[8px]',
    'rounded-e-xl': 'rounded-se-[24px] rounded-ee-[24px]',
    'rounded-e-pill': 'rounded-se-full rounded-ee-full',
  },
  rules: [
    ['elevation-0', { 'box-shadow': 'none' }],
    ['elevation-1', { 'box-shadow': 'var(--shadow-xs)' }],
    ['elevation-2', { 'box-shadow': 'var(--shadow-sm)' }],
    ['elevation-3', { 'box-shadow': 'var(--shadow-md)' }],
    ['elevation-4', { 'box-shadow': 'var(--shadow-xl)' }],
    ['elevation-5', { 'box-shadow': 'var(--shadow-2xl)' }],
  ],
  theme: {
    breakpoint: forUnoCSS,
    colors: {
      background: 'rgb(var(--v-theme-background))',
      surface: 'rgb(var(--v-theme-surface))',
      'surface-variant': 'rgb(var(--v-theme-surface-variant))',
      'on-surface': 'rgb(var(--v-theme-on-surface))',
      outline: 'rgb(var(--v-theme-outline))',
      primary: 'rgb(var(--v-theme-primary))',
      secondary: 'rgb(var(--v-theme-secondary))',
      success: 'rgb(var(--v-theme-success))',
      warning: 'rgb(var(--v-theme-warning))',
      error: 'rgb(var(--v-theme-error))',
      info: 'rgb(var(--v-theme-info))',
    },
  },
})
