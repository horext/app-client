import type { ICalendarEvent } from '../types'

export interface CalendarEventVisual<T extends ICalendarEvent> {
  event: T
  column: number
  columnCount: number
  left: number
  width: number
}

const WIDTH_FULL = 100

function hasOverlap(s0: string, e0: string, s1: string, e1: string): boolean {
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

  visuals.sort((a, b) => {
    if (a.event.start < b.event.start) return -1
    if (a.event.start > b.event.start) return 1
    if (a.event.end > b.event.end) return -1
    if (a.event.end < b.event.end) return 1
    return 0
  })

  return visuals
}

interface ColumnGroup<T extends ICalendarEvent> {
  start: string
  end: string
  visuals: CalendarEventVisual<T>[]
}

function getOpenGroup<T extends ICalendarEvent>(
  groups: ColumnGroup<T>[],
  start: string,
  end: string,
): number {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]!
    let intersected = false

    if (hasOverlap(start, end, group.start, group.end)) {
      for (const groupVisual of group.visuals) {
        if (
          hasOverlap(start, end, groupVisual.event.start, groupVisual.event.end)
        ) {
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
  for (const group of groups) {
    for (const visual of group.visuals) {
      visual.columnCount = groups.length
    }
  }
}

export function extractBlocks<T extends ICalendarEvent>(
  events: T[],
): CalendarEventVisual<T>[] {
  if (events.length === 0) return []

  const visuals = getVisuals(events)
  const groups: ColumnGroup<T>[] = []
  let min = ''
  let max = ''

  for (const visual of visuals) {
    const start = visual.event.start
    const end = visual.event.end

    if (groups.length > 0 && !hasOverlap(start, end, min, max)) {
      setColumnCount(groups)
      groups.length = 0
      min = ''
      max = ''
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
    target.start = target.start < start ? target.start : start
    target.end = target.end > end ? target.end : end
    visual.column = targetGroup

    if (min === '') {
      min = start
      max = end
    } else {
      min = min < start ? min : start
      max = max > end ? max : end
    }
  }

  setColumnCount(groups)

  for (const visual of visuals) {
    visual.left = (visual.column * WIDTH_FULL) / visual.columnCount
    visual.width = WIDTH_FULL / visual.columnCount
  }

  return visuals
}
