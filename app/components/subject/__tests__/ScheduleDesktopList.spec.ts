import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleDesktopList from '~/components/subject/ScheduleDesktopList.vue'
import ScheduleDesktopSection from '~/components/subject/ScheduleDesktopSection.vue'
import { makeSchedule } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleDesktopList', () => {
  describe('given schedules are loading', () => {
    it('displays a table skeleton without schedule sections', () => {
      const wrapper = mount(ScheduleDesktopList, {
        props: {
          schedules: [makeSchedule(1, 'A')],
          loading: true,
          modelValue: [],
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
      const schedules = [makeSchedule(1, 'A'), makeSchedule(2, 'B')]
      const wrapper = mount(ScheduleDesktopList, {
        props: { schedules, loading: false, modelValue: [] },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findAllComponents(ScheduleDesktopSection)).toHaveLength(2)
    })
  })
})
