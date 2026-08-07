import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useCalendarVisuals } from '../useCalendarEvents'
import type { ICalendarEvent } from '../../types'
import type { Weekdays } from '../../constants/week'

function makeEvent(
  id: string,
  weekDay: Weekdays,
  start: string,
  end: string,
): ICalendarEvent {
  return { id, weekDay, start, end, name: `Event ${id}` }
}

describe('useCalendarVisuals', () => {
  it('returns empty map when there are no events', () => {
    const events = ref<ICalendarEvent[]>([])
    const weekdays = ref<Weekdays[]>([1, 2, 3, 4, 5] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)
    expect(visualsByWeekday.value.size).toBe(5)
    for (const [, visuals] of visualsByWeekday.value) {
      expect(visuals).toEqual([])
    }
  })

  it('places event in correct weekday bucket', () => {
    const events = ref<ICalendarEvent[]>([
      makeEvent('1', 1 as Weekdays, '08:00', '09:00'),
    ])
    const weekdays = ref<Weekdays[]>([1] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)
    expect(visualsByWeekday.value.get(1 as Weekdays)).toHaveLength(1)
  })

  it('handles events on multiple weekdays', () => {
    const events = ref<ICalendarEvent[]>([
      makeEvent('1', 1 as Weekdays, '08:00', '09:00'),
      makeEvent('2', 3 as Weekdays, '10:00', '11:00'),
    ])
    const weekdays = ref<Weekdays[]>([1, 2, 3] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)
    expect(visualsByWeekday.value.get(1 as Weekdays)).toHaveLength(1)
    expect(visualsByWeekday.value.get(2 as Weekdays)).toHaveLength(0)
    expect(visualsByWeekday.value.get(3 as Weekdays)).toHaveLength(1)
  })

  it('handles multiple events on the same weekday', () => {
    const events = ref<ICalendarEvent[]>([
      makeEvent('1', 2 as Weekdays, '08:00', '09:00'),
      makeEvent('2', 2 as Weekdays, '10:00', '11:00'),
    ])
    const weekdays = ref<Weekdays[]>([2] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)
    expect(visualsByWeekday.value.get(2 as Weekdays)).toHaveLength(2)
  })

  it('handles weekDay=7 by mapping to weekday 0 (modulo)', () => {
    // weekDay 7 % 7 = 0
    const events = ref<ICalendarEvent[]>([
      makeEvent('1', 7 as Weekdays, '08:00', '09:00'),
    ])
    const weekdays = ref<Weekdays[]>([0] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)
    expect(visualsByWeekday.value.get(0 as Weekdays)).toHaveLength(1)
  })

  it('is reactive when events ref changes', () => {
    const events = ref<ICalendarEvent[]>([])
    const weekdays = ref<Weekdays[]>([1] as Weekdays[])
    const { visualsByWeekday } = useCalendarVisuals(events, weekdays)

    expect(visualsByWeekday.value.get(1 as Weekdays)).toHaveLength(0)

    events.value = [makeEvent('x', 1 as Weekdays, '09:00', '10:00')]
    expect(visualsByWeekday.value.get(1 as Weekdays)).toHaveLength(1)
  })
})
