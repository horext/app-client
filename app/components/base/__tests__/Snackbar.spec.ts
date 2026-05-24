import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import Snackbar from '~/components/base/Snackbar.vue'
import type { SnackbarVariant } from '~/components/base/Snackbar.vue'

const vuetify = createVuetify()

const variants: SnackbarVariant[] = ['success', 'error', 'warning', 'info']

describe('Snackbar', () => {
  it('renders when modelValue is true', () => {
    const wrapper = shallowMount(Snackbar, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom timeout', () => {
    const wrapper = shallowMount(Snackbar, {
      props: { modelValue: true, timeout: 5000 },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  variants.forEach((variant) => {
    it(`renders correctly with variant "${variant}"`, () => {
      const wrapper = shallowMount(Snackbar, {
        props: { modelValue: true, variant },
        global: { plugins: [vuetify] },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  it('emits update:modelValue with false when closed', () => {
    const wrapper = shallowMount(Snackbar, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
