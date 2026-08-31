import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleDesktopList from '~/components/subject/ScheduleDesktopList.vue'
import ScheduleDesktopSection from '~/components/subject/ScheduleDesktopSection.vue'
import { makeSchedule, makeScheduleOption } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleDesktopList', () => {
  describe('given schedules are loading', () => {
    it('displays a table skeleton without schedule sections', () => {
      const wrapper = mount(ScheduleDesktopList, {
        props: {
          schedules: [makeScheduleOption(makeSchedule(1, 'A'))],
          loading: true,
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VSkeletonLoader' }).exists()).toBe(
        true,
      )
      expect(wrapper.findAllComponents(ScheduleDesktopSection)).toHaveLength(0)
    })
  })

  describe('given loaded schedules', () => {
    it('displays one desktop section for each available schedule', () => {
      const schedules = [
        makeScheduleOption(makeSchedule(1, 'A')),
        makeScheduleOption(makeSchedule(2, 'B')),
      ]
      const wrapper = mount(ScheduleDesktopList, {
        props: { schedules, loading: false, showChanges: false },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findAllComponents(ScheduleDesktopSection)).toHaveLength(2)
    })

    it('relays the section selection request with its identifier', () => {
      const wrapper = mount(ScheduleDesktopList, {
        props: {
          schedules: [makeScheduleOption(makeSchedule(1, 'A'))],
          loading: false,
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      wrapper
        .findComponent(ScheduleDesktopSection)
        .vm.$emit('update:selected', true)

      expect(wrapper.emitted('update:selected')).toEqual([['A', true]])
    })
  })
})
