import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleMobileSection from '~/components/subject/ScheduleMobileSection.vue'
import { makeSchedule, makeScheduleOption } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleMobileSection', () => {
  describe('given an unselected section', () => {
    it('adds the schedule when the user selects its card', async () => {
      const schedule = makeSchedule(1, 'A')
      const option = makeScheduleOption(schedule)
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: { option, showChanges: false },
        global: { plugins: [vuetify] },
      })

      await wrapper.findComponent({ name: 'VCard' }).trigger('click')

      expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([true])
      expect(option.selected).toBe(false)
    })
  })

  describe('given a selected section', () => {
    it('removes the matching section when the user selects its card again', async () => {
      const schedule = makeSchedule(1, 'A')
      const option = makeScheduleOption(schedule, undefined, true)
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: { option, showChanges: false },
        global: { plugins: [vuetify] },
      })

      await wrapper.findComponent({ name: 'VCard' }).trigger('click')

      expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([false])
      expect(option.selected).toBe(true)
    })
  })

  describe('given a section without sessions', () => {
    it('keeps the card selectable and exposes its unchecked state', () => {
      const wrapper = shallowMount(ScheduleMobileSection, {
        props: {
          option: makeScheduleOption(makeSchedule(1, 'A')),
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(
        wrapper.findComponent({ name: 'VCard' }).attributes('aria-checked'),
      ).toBe('false')
    })
  })
})
