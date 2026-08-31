import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleMobileList from '~/components/subject/ScheduleMobileList.vue'
import ScheduleMobileSection from '~/components/subject/ScheduleMobileSection.vue'
import { makeSchedule, makeScheduleOption } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleMobileList', () => {
  describe('given schedules are loading', () => {
    it('displays card skeletons without schedule sections', () => {
      const wrapper = shallowMount(ScheduleMobileList, {
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
      expect(wrapper.findAllComponents(ScheduleMobileSection)).toHaveLength(0)
    })
  })

  describe('given loaded schedules', () => {
    it('displays one mobile section for each available schedule', () => {
      const schedules = [
        makeScheduleOption(makeSchedule(1, 'A')),
        makeScheduleOption(makeSchedule(2, 'B')),
      ]
      const wrapper = shallowMount(ScheduleMobileList, {
        props: { schedules, loading: false, showChanges: false },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findAllComponents(ScheduleMobileSection)).toHaveLength(2)
    })
  })
})
