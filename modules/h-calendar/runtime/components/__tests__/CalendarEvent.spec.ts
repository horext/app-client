import { shallowMount } from '@vue/test-utils'
import CalendarEvent from '../CalendarEvent.vue'
import { describe, it, expect } from 'vitest'
import type { ICalendarEvent } from '../../types'

describe('CalendarEvent', () => {
  it('renders event name and time correctly', () => {
    const event: ICalendarEvent = {
      name: 'Meeting',
      start: '09:00',
      end: '10:30',
      id: '1',
      weekDay: 0,
    }
    const wrapper = shallowMount(CalendarEvent, {
      props: {
        event,
        startIntervalHour: 8,
        intervalMinuteHeight: 30,
        events: [event],
      },
    })

    expect(wrapper.find('.event-name').text()).toBe('Meeting')
    expect(wrapper.find('.event-time').text()).toBe('09:00 - 10:30')
  })

  it('emits events on user interactions', () => {
    const event: ICalendarEvent = {
      name: 'Meeting',
      start: '09:00',
      end: '10:30',
      id: '2',
      weekDay: 0,
    }
    const wrapper = shallowMount(CalendarEvent, {
      props: {
        event,
        startIntervalHour: 8,
        intervalMinuteHeight: 30,
        events: [event],
      },
    })

    wrapper.trigger('dblclick')
    expect(wrapper.emitted('dblclick')).toBeTruthy()

    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()

    wrapper.trigger('mousedown')
    expect(wrapper.emitted('mousedown')).toBeTruthy()

    wrapper.trigger('mouseenter')
    expect(wrapper.emitted('mouseenter')).toBeTruthy()

    wrapper.trigger('mouseleave')
    expect(wrapper.emitted('mouseleave')).toBeTruthy()

    wrapper.trigger('mousemove')
    expect(wrapper.emitted('mousemove')).toBeTruthy()
  })
})
