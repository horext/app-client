import { mount } from '@vue/test-utils'
import Mode from '../Mode.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { ViewMode } from '~/models/ViewMode'
import { createVuetify } from 'vuetify'
import { VRadioGroup } from 'vuetify/components'

const vuetify = createVuetify()

describe('ScheduleMode', () => {
  it('sets the correct initial mode', () => {
    const mode = ViewMode.CALENDAR
    const wrapper = mount(Mode, {
      props: {
        mode: mode,
      },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('emits an event when the mode is updated', async () => {
    const mode = ViewMode.LIST
    const wrapper = mount(Mode, {
      props: {
        mode,
      },
      global: {
        plugins: [vuetify],
      },
    })
    const newMode = ViewMode.CALENDAR
    const radioGroup = wrapper.findComponent(VRadioGroup)
    radioGroup.vm.$emit('update:modelValue', newMode)
    expect(wrapper.emitted('update:mode')).toBeTruthy()
    expect(wrapper.emitted('update:mode')?.[0][0]).toBe(newMode)
  })
})
