import { shallowMount } from '@vue/test-utils'
import CalendarTime from '../CalendarTime.vue'
import { describe, it, expect } from 'vitest'

describe('CalendarTime', () => {
  it('renders the correct number of time slots', () => {
    const hours = ['9:00 AM', '10:00 AM', '11:00 AM']
    const wrapper = shallowMount(CalendarTime, {
      props: {
        hours,
        intervalHeight: 2,
      },
    })

    const timeSlots = wrapper.findAll('.h-calendar-time-slot')
    expect(timeSlots.length).toBe(hours.length)
  })

  it('displays the correct hour in each time slot', () => {
    const hours = ['9:00 AM', '10:00 AM', '11:00 AM']
    const wrapper = shallowMount(CalendarTime, {
      props: {
        hours,
        intervalHeight: 2,
      },
    })

    const timeSlots = wrapper.findAll('.h-calendar-time-slot')
    timeSlots.forEach((timeSlot, index) => {
      expect(timeSlot.text()).toBe(hours[index])
    })
  })
})
