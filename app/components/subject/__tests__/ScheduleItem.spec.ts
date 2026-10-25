import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import ScheduleItem from '~/components/subject/ScheduleItem.vue'
import { makeSchedule } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleItem', () => {
  describe('given schedules are loading', () => {
    it('hides the bulk selection control', () => {
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules: [],
          loading: true,
          modelValue: [],
          allSelected: false,
          partiallySelected: false,
          selectedCount: 0,
          totalCount: 0,
        },
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
        props: {
          schedules: [],
          loading: false,
          modelValue: [],
          allSelected: false,
          partiallySelected: false,
          selectedCount: 0,
          totalCount: 0,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VCheckboxBtn' }).exists()).toBe(
        false,
      )
    })
  })

  describe('given available schedules', () => {
    it('selects all schedules when the user selects all', async () => {
      const schedules = [makeSchedule(1, 'A'), makeSchedule(2, 'B')]
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules,
          loading: false,
          modelValue: [],
          allSelected: false,
          partiallySelected: false,
          selectedCount: 0,
          totalCount: 2,
        },
        global: { plugins: [vuetify] },
      })

      wrapper
        .findComponent({ name: 'VCheckboxBtn' })
        .vm.$emit('update:modelValue', true)
      await nextTick()

      expect(wrapper.emitted('select-all')?.at(-1)).toEqual([true])
    })

    it('clears all schedules when the user deselects all', async () => {
      const schedules = [makeSchedule(1, 'A'), makeSchedule(2, 'B')]
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules,
          loading: false,
          modelValue: schedules,
          allSelected: true,
          partiallySelected: false,
          selectedCount: 2,
          totalCount: 2,
        },
        global: { plugins: [vuetify] },
      })

      wrapper
        .findComponent({ name: 'VCheckboxBtn' })
        .vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('select-all')?.at(-1)).toEqual([false])
    })

    it('shows an indeterminate state when only some are selected', () => {
      const schedules = [makeSchedule(1, 'A'), makeSchedule(2, 'B')]
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules,
          loading: false,
          modelValue: [schedules[0]!],
          allSelected: false,
          partiallySelected: true,
          selectedCount: 1,
          totalCount: 2,
        },
        global: { plugins: [vuetify] },
      })

      expect(
        wrapper.findComponent({ name: 'VCheckboxBtn' }).props('indeterminate'),
      ).toBe(true)
      expect(wrapper.text()).toContain('1 de 2')
    })

    it('does not count a selected section that is no longer available', () => {
      const wrapper = shallowMount(ScheduleItem, {
        props: {
          schedules: [makeSchedule(1, 'A')],
          loading: false,
          modelValue: [makeSchedule(2, 'REMOVED')],
          allSelected: false,
          partiallySelected: false,
          selectedCount: 0,
          totalCount: 1,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.text()).toContain('0 de 1')
      expect(
        wrapper.findComponent({ name: 'VCheckboxBtn' }).props('indeterminate'),
      ).toBe(false)
    })
  })
})
