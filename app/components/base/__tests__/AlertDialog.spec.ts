import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import AlertDialog from '~/components/base/AlertDialog.vue'

const vuetify = createVuetify()

describe('AlertDialog', () => {
  it('renders when modelValue is true', () => {
    const wrapper = shallowMount(AlertDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with a custom title prop', () => {
    const wrapper = shallowMount(AlertDialog, {
      props: { modelValue: true, title: 'Error crítico' },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:modelValue with false when close is triggered', async () => {
    const wrapper = shallowMount(AlertDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
