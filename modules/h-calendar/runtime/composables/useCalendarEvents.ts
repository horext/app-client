import { computed, type Ref } from 'vue'
import type { ICalendarEvent } from '../types'
import type { Weekdays } from '../constants/week'
import { extractBlocks, type CalendarEventVisual } from '../utils/block'

export type { CalendarEventVisual } from '../utils/block'

function useEventsByWeekday<T extends ICalendarEvent>(events: Ref<T[]>) {
  const eventsByWeekday = computed(() => {
    const map = new Map<Weekdays, T[]>()

    for (const event of events.value) {
      const weekday = (event.weekDay % 7) as Weekdays
      const existing = map.get(weekday)
      if (existing) {
        existing.push(event)
      } else {
        map.set(weekday, [event])
      }
    }

    return map
  })

  return { eventsByWeekday }
}

export function useCalendarVisuals<T extends ICalendarEvent>(
  events: Ref<T[]>,
  weekdays: Ref<Weekdays[]>,
) {
  const { eventsByWeekday } = useEventsByWeekday(events)

  const visualsByWeekday = computed(() => {
    const map = new Map<Weekdays, CalendarEventVisual<T>[]>()

    for (const weekday of weekdays.value) {
      const dayEvents = eventsByWeekday.value.get(weekday) ?? []
      const visuals = extractBlocks(dayEvents)
      map.set(weekday, visuals)
    }

    return map
  })

  return { visualsByWeekday }
}
