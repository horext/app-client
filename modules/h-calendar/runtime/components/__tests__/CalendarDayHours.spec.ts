import { shallowMount } from '@vue/test-utils'
import CalendarDayHour from '../CalendarDayHour.vue'
import { describe, it, expect } from 'vitest'

describe('CalendarDayHour', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(CalendarDayHour, {
      props: {
        hour: '10:00',
        intervalHeight: 2,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.h-calendar-day-hour').exists()).toBe(true)
    expect(wrapper.find('.h-calendar-day-hour-slot').exists()).toBe(true)
  })

  it('emits events on user interactions', () => {
    const wrapper = shallowMount(CalendarDayHour, {
      props: {
        hour: '10:00',
        intervalHeight: 2,
      },
    })

    const eventWrapper = wrapper.find('.h-calendar-day-hour')

    expect(eventWrapper.exists()).toBe(true)

    eventWrapper.trigger('mouseover')
    expect(wrapper.emitted('mouseover')).toBeTruthy()

    eventWrapper.trigger('mousedown')
    expect(wrapper.emitted('mousedown')).toBeTruthy()

    eventWrapper.trigger('mouseleave')
    expect(wrapper.emitted('mouseleave')).toBeTruthy()

    eventWrapper.trigger('mouseup')
    expect(wrapper.emitted('mouseup')).toBeTruthy()

    eventWrapper.trigger('mousemove')
    expect(wrapper.emitted('mousemove')).toBeTruthy()
  })
})
