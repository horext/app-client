import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import ScheduleDesktopSection from '~/components/subject/ScheduleDesktopSection.vue'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import { makeSchedule, makeScheduleOption, makeSession } from './fixtures'

const vuetify = createVuetify()

describe('subject/ScheduleDesktopSection', () => {
  describe('given an available section', () => {
    it('displays its identifier as the selection label', () => {
      const wrapper = shallowMount(ScheduleDesktopSection, {
        props: {
          option: makeScheduleOption(makeSchedule(1, 'A')),
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VCheckbox' }).props('label')).toBe(
        'A',
      )
    })

    it('displays every session belonging to the section', () => {
      const wrapper = shallowMount(ScheduleDesktopSection, {
        props: {
          option: makeScheduleOption(
            makeSchedule(1, 'A', [makeSession(1), makeSession(2)]),
          ),
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findAllComponents(ClassSessionItem)).toHaveLength(2)
    })

    it('still displays a selectable section when it has no sessions', () => {
      const wrapper = shallowMount(ScheduleDesktopSection, {
        props: {
          option: makeScheduleOption(makeSchedule(1, 'A')),
          showChanges: false,
        },
        global: { plugins: [vuetify] },
      })

      expect(wrapper.findComponent({ name: 'VCheckbox' }).exists()).toBe(true)
      expect(wrapper.findAllComponents(ClassSessionItem)).toHaveLength(0)
    })

    it('emits a selection request without mutating the option', async () => {
      const option = makeScheduleOption(makeSchedule(1, 'A'))
      const wrapper = shallowMount(ScheduleDesktopSection, {
        props: { option, showChanges: false },
        global: { plugins: [vuetify] },
      })

      await wrapper
        .findComponent({ name: 'VCheckbox' })
        .vm.$emit('update:modelValue', true)

      expect(wrapper.emitted('update:selected')).toEqual([[true]])
      expect(option.selected).toBe(false)
    })
  })
})
