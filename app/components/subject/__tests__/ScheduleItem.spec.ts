import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import ScheduleItem from '~/components/subject/ScheduleItem.vue'
import { makeSchedule, makeScheduleOption } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleItem', () => {
  describe('given schedules are loading', () => {
    it('hides the bulk selection control', () => {
      const wrapper = shallowMount(ScheduleItem, {
        props: { schedules: [], loading: true },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VCheckboxBtn' }).exists()).toBe(
        false,
      )
    })
  })

  describe('given no available schedules', () => {
    it('does not offer bulk selection', () => {
      const wrapper = shallowMount(ScheduleItem, {
        props: { schedules: [], loading: false },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VCheckboxBtn' }).exists()).toBe(
        false,
      )
    })
  })

  describe('given available schedules', () => {
    it('selects all schedules when the user selects all', async () => {
      const schedules = [
        makeScheduleOption(makeSchedule(1, 'A')),
        makeScheduleOption(makeSchedule(2, 'B')),
      ]
      const wrapper = shallowMount(ScheduleItem, {
        props: { schedules, loading: false },
        global: { plugins: [vuetify] },
      })

      wrapper
        .findComponent({ name: 'VCheckboxBtn' })
        .vm.$emit('update:modelValue', true)
      await nextTick()

      expect(schedules.every(({ selected }) => selected)).toBe(true)
    })

    it('clears all schedules when the user deselects all', async () => {
      const schedules = [
        makeScheduleOption(makeSchedule(1, 'A'), undefined, true),
        makeScheduleOption(makeSchedule(2, 'B'), undefined, true),
      ]
      const wrapper = shallowMount(ScheduleItem, {
        props: { schedules, loading: false },
        global: { plugins: [vuetify] },
      })

      wrapper
        .findComponent({ name: 'VCheckboxBtn' })
        .vm.$emit('update:modelValue', false)
      await nextTick()

      expect(schedules.every(({ selected }) => !selected)).toBe(true)
    })

    it('shows an indeterminate state when only some are selected', () => {
      const schedules = [
        makeScheduleOption(makeSchedule(1, 'A'), undefined, true),
        makeScheduleOption(makeSchedule(2, 'B')),
      ]
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules,
          loading: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(
        wrapper.findComponent({ name: 'VCheckboxBtn' }).props('indeterminate'),
      ).toBe(true)
      expect(wrapper.text()).toContain('1 de 2')
    })
  })
})
