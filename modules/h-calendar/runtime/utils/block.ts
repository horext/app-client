import type { ICalendarEvent } from '../types'

export interface CalendarEventVisual<T extends ICalendarEvent> {
  event: T
  column: number
  columnCount: number
  left: number
  width: number
}

const WIDTH_FULL = 100

/**
 * Convert time string "HH:MM" to minutes for numeric comparison.
 * This is more reliable than string comparison for time ranges.
 */
function timeToMinutes(time: string): number {
  const parts = time.split(':')
  const hours = Number(parts[0] ?? 0)
  const minutes = Number(parts[1] ?? 0)
  return hours * 60 + minutes
}

/**
 * Check if two time ranges overlap.
 * Uses exclusive comparison: [s0, e0) and [s1, e1)
 */
function hasOverlap(s0: number, e0: number, s1: number, e1: number): boolean {
  return !(s0 >= e1 || e0 <= s1)
}

function getVisuals<T extends ICalendarEvent>(
  events: T[],
): CalendarEventVisual<T>[] {
  const visuals = events.map((event) => ({
    event,
    column: 0,
    columnCount: 0,
    left: 0,
    width: WIDTH_FULL,
  }))

  // Sort by start time (ascending), then by duration (descending - longer events first)
  visuals.sort((a, b) => {
    const aStart = timeToMinutes(a.event.start)
    const bStart = timeToMinutes(b.event.start)
    if (aStart !== bStart) return aStart - bStart

    const aEnd = timeToMinutes(a.event.end)
    const bEnd = timeToMinutes(b.event.end)
    // Longer events (larger duration) come first
    return bEnd - aEnd
  })

  return visuals
}

interface ColumnGroup<T extends ICalendarEvent> {
  start: number
  end: number
  visuals: CalendarEventVisual<T>[]
}

function getOpenGroup<T extends ICalendarEvent>(
  groups: ColumnGroup<T>[],
  start: number,
  end: number,
): number {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]!
    let intersected = false

    if (hasOverlap(start, end, group.start, group.end)) {
      for (const groupVisual of group.visuals) {
        const groupStart = timeToMinutes(groupVisual.event.start)
        const groupEnd = timeToMinutes(groupVisual.event.end)
        if (hasOverlap(start, end, groupStart, groupEnd)) {
          intersected = true
          break
        }
      }
    }

    if (!intersected) {
      return i
    }
  }
  return -1
}

function setColumnCount<T extends ICalendarEvent>(
  groups: ColumnGroup<T>[],
): void {
  const columnCount = groups.length
  for (const group of groups) {
    for (const visual of group.visuals) {
      visual.columnCount = columnCount
    }
  }
}

/**
 * Extract overlapping blocks and calculate column positions for events.
 * This algorithm is based on Vuetify's column mode:
 * 1. Sort events by start time, then by duration (longer first)
 * 2. Group overlapping events into columns
 * 3. When events don't overlap with the current group, finalize and start new
 * 4. Calculate left/width based on column position
 */
export function extractBlocks<T extends ICalendarEvent>(
  events: T[],
): CalendarEventVisual<T>[] {
  if (events.length === 0) return []

  const visuals = getVisuals(events)
  const groups: ColumnGroup<T>[] = []
  let min = -1
  let max = -1

  for (const visual of visuals) {
    const start = timeToMinutes(visual.event.start)
    const end = timeToMinutes(visual.event.end)

    // When we encounter an event that doesn't overlap with any previous events,
    // finalize the column counts for the previous group and start fresh
    if (groups.length > 0 && !hasOverlap(start, end, min, max)) {
      setColumnCount(groups)
      groups.length = 0
      min = -1
      max = -1
    }

    let targetGroup = getOpenGroup(groups, start, end)

    if (targetGroup === -1) {
      targetGroup = groups.length
      groups.push({
        start,
        end,
        visuals: [],
      })
    }

    const target = groups[targetGroup]!
    target.visuals.push(visual)
    target.start = Math.min(target.start, start)
    target.end = Math.max(target.end, end)
    visual.column = targetGroup

    if (min === -1) {
      min = start
      max = end
    } else {
      min = Math.min(min, start)
      max = Math.max(max, end)
    }
  }

  setColumnCount(groups)

  // Calculate left and width based on column position
  for (const visual of visuals) {
    visual.left = (visual.column * WIDTH_FULL) / visual.columnCount
    visual.width = WIDTH_FULL / visual.columnCount
  }

  return visuals
}
