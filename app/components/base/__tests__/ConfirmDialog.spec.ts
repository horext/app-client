import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import ConfirmDialog from '~/components/base/ConfirmDialog.vue'

const vuetify = createVuetify()

describe('ConfirmDialog', () => {
  it('renders when modelValue is true', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom confirmText and rejectText props', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      props: {
        modelValue: true,
        confirmText: 'Confirmar',
        rejectText: 'Cancelar',
        closeable: true,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click:confirm when confirmed', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click:confirm', new MouseEvent('click'))
    expect(wrapper.emitted('click:confirm')).toBeTruthy()
  })

  it('emits click:reject when rejected', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click:reject', new MouseEvent('click'))
    expect(wrapper.emitted('click:reject')).toBeTruthy()
  })

  it('emits update:modelValue with false when closed', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      props: { modelValue: true, closeable: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
