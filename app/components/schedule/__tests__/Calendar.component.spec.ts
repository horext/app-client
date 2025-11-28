import { mount } from '@vue/test-utils'
import ScheduleCalendar from '~/components/schedule/Calendar.vue'
import { DEFAULT_CALENDAR_WEEK_DAYS } from '~/constants/weekdays'
import { nextTick } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { VMenu } from 'vuetify/components'

const vuetify = createVuetify()
vi.stubGlobal('visualViewport', new EventTarget())
describe('Schedule Calendar', () => {
  const scheduleMock: IScheduleGenerate = {
    events: [
      {
        id: '1',
        title: 'Event 1',
        startTime: '08:00',
        endTime: '09:00',
        day: 1,
        color: '',
        type: '',
      },
      {
        id: '2',
        title: 'Event 2',
        startTime: '10:00',
        endTime: '11:00',
        day: 2,
        color: '',
        type: '',
      },
    ],
    id: '',
    scheduleSubjectIds: [],
    schedule: [],
    crossings: 0,
  }
  it('renders correctly', () => {
    const wrapper = mount(ScheduleCalendar, {
      props: {
        schedule: scheduleMock,
        weekDays: DEFAULT_CALENDAR_WEEK_DAYS,
      },
      global: {
        plugins: [vuetify],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('showEvent method updates state correctly', async () => {
    const wrapper = mount(ScheduleCalendar, {
      props: {
        schedule: scheduleMock,
        weekDays: DEFAULT_CALENDAR_WEEK_DAYS,
      },
      global: {
        plugins: [vuetify],
      },
    })
    const event = {
      id: '1',
      name: 'Event 1',
      start: '08:00',
      end: '09:00',
      weekDay: 1,
    }
    const nativeEvent = {
      target: document.createElement('div'),
      stopPropagation: vi.fn(),
    }
    const calendar = wrapper.findComponent({
      name: 'HCalendar',
    })
    expect(calendar.exists()).toBe(true)
    calendar.vm.$emit('click:event', { nativeEvent, event })
    await nextTick()
    expect(nativeEvent.stopPropagation).toHaveBeenCalled()
  })

  it('v-menu shows up when an event is clicked', async () => {
    const wrapper = mount(ScheduleCalendar, {
      props: {
        schedule: scheduleMock,
        weekDays: DEFAULT_CALENDAR_WEEK_DAYS,
      },
      global: {
        plugins: [vuetify],
      },
    })
    const event = {
      id: '1',
      name: 'Event 1',
      start: '08:00',
      end: '09:00',
      weekDay: 1,
    }
    const nativeEvent = {
      target: document.createElement('div'),
      stopPropagation: vi.fn(),
    }
    const calendar = wrapper.findComponent({
      name: 'HCalendar',
    })
    expect(calendar.exists()).toBe(true)
    calendar.vm.$emit('click:event', { nativeEvent, event })
    await nextTick()
    expect(wrapper.findComponent(VMenu).exists()).toBe(true)
  })
})
