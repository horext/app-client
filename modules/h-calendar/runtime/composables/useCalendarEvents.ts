import { computed, type Ref } from 'vue'
import type { ICalendarEvent } from '../types'
import type { Weekdays } from '../constants/week'
import { extractBlocks } from '../utils/block'

export type { CalendarEventVisual } from '../utils/block'

/**
 * Creates an event map keyed by weekday for efficient lookups.
 * This avoids filtering the full event array on each day render.
 */
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

/**
 * Creates computed visuals for all weekdays with proper caching.
 * Visuals are only recalculated when the events for that day change.
 */
export function useCalendarVisuals<T extends ICalendarEvent>(
  events: Ref<T[]>,
  weekdays: Ref<Weekdays[]>,
) {
  const { eventsByWeekday } = useEventsByWeekday(events)

  const visualsByWeekday = computed(() => {
    const map = new Map<Weekdays, ReturnType<typeof extractBlocks<T>>>()

    for (const weekday of weekdays.value) {
      const dayEvents = eventsByWeekday.value.get(weekday) ?? []
      const visuals = extractBlocks(dayEvents)
      map.set(weekday, visuals)
    }

    return map
  })

  return { visualsByWeekday }
}
