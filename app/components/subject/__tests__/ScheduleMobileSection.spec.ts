import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleMobileSection from '~/components/subject/ScheduleMobileSection.vue'
import { makeSchedule } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleMobileSection', () => {
  describe('given an unselected section', () => {
    it('adds the schedule when the user selects its card', async () => {
      const schedule = makeSchedule(1, 'A')
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: { schedule, modelValue: [] },
        global: { plugins: [vuetify] },
      })

      await wrapper.findComponent({ name: 'VCard' }).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[schedule]])
    })
  })

  describe('given a selected section', () => {
    it('removes the matching section when the user selects its card again', async () => {
      const schedule = makeSchedule(1, 'A')
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: { schedule, modelValue: [makeSchedule(99, 'A')] },
        global: { plugins: [vuetify] },
      })

      await wrapper.findComponent({ name: 'VCard' }).trigger('click')

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    })
  })

  describe('given a section without sessions', () => {
    it('keeps the card selectable and exposes its unchecked state', () => {
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: { schedule: makeSchedule(1, 'A'), modelValue: [] },
        global: { plugins: [vuetify] },
      })

      expect(
        wrapper.findComponent({ name: 'VCard' }).attributes('aria-checked'),
      ).toBe('false')
    })
  })
})
