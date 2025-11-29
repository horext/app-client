import type { ICalendarEvent } from '../types'

export interface CalendarEventVisual<T extends ICalendarEvent> {
  event: T
  column: number
  columnCount: number
  left: number
  width: number
}

const WIDTH_FULL = 100
const MIN_WIDTH = 10 // Minimum width percentage to ensure visibility
const MIN_EVENT_DURATION = 1 // Minimum 1 minute duration for zero-length events

/**
 * Convert time string "HH:MM" to minutes for numeric comparison.
 * Returns null for invalid formats to detect parsing errors.
 */
function timeToMinutes(time: string): number {
  if (!time || typeof time !== 'string') {
    return 0
  }
  const parts = time.split(':')
  const hours = Number(parts[0] ?? 0)
  const minutes = Number(parts[1] ?? 0)
  
  // Validate parsed values
  if (isNaN(hours) || isNaN(minutes)) {
    return 0
  }
  
  return hours * 60 + minutes
}

/**
 * Check if two time ranges overlap.
 * Uses exclusive comparison: [s0, e0) and [s1, e1)
 * For zero-duration events, treats them as having MIN_EVENT_DURATION.
 */
function hasOverlap(s0: number, e0: number, s1: number, e1: number): boolean {
  // Handle zero-duration events by giving them minimum duration
  const end0 = e0 <= s0 ? s0 + MIN_EVENT_DURATION : e0
  const end1 = e1 <= s1 ? s1 + MIN_EVENT_DURATION : e1
  
  return !(s0 >= end1 || end0 <= s1)
}

/**
 * Get normalized start/end times for an event.
 * Ensures end > start for proper overlap detection.
 */
function getEventTimes(event: ICalendarEvent): { start: number; end: number } {
  const start = timeToMinutes(event.start)
  let end = timeToMinutes(event.end)
  
  // Ensure minimum duration
  if (end <= start) {
    end = start + MIN_EVENT_DURATION
  }
  
  return { start, end }
}

interface ColumnGroup<T extends ICalendarEvent> {
  start: number
  end: number
  visuals: CalendarEventVisual<T>[]
}

/**
 * Find the first available column for an event.
 * Returns the column index where no existing event overlaps with the given time range.
 */
function getOpenColumn<T extends ICalendarEvent>(
  groups: ColumnGroup<T>[],
  start: number,
  end: number,
): number {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]!
    let hasConflict = false

    for (const groupVisual of group.visuals) {
      const times = getEventTimes(groupVisual.event)
      if (hasOverlap(start, end, times.start, times.end)) {
        hasConflict = true
        break
      }
    }

    if (!hasConflict) {
      return i
    }
  }
  return -1
}

/**
 * Calculate how many consecutive columns an event can span,
 * starting from its assigned column.
 */
function getColumnSpan<T extends ICalendarEvent>(
  groups: ColumnGroup<T>[],
  start: number,
  end: number,
  fromColumn: number,
): number {
  let span = 1
  
  for (let i = fromColumn + 1; i < groups.length; i++) {
    const group = groups[i]!
    let hasConflict = false
    
    for (const groupVisual of group.visuals) {
      const times = getEventTimes(groupVisual.event)
      if (hasOverlap(start, end, times.start, times.end)) {
        hasConflict = true
        break
      }
    }
    
    if (hasConflict) {
      break
    }
    span++
  }
  
  return span
}

/**
 * Clamp a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Extract overlapping blocks and calculate column positions for events.
 * 
 * Algorithm (enhanced column mode):
 * 1. Sort events by start time, then by duration (longer first)
 * 2. Assign each event to the first available column
 * 3. Track the overall time range of the current overlap group
 * 4. When an event doesn't overlap with ANY previous event, start a new group
 * 5. Calculate width based on how many consecutive columns the event can span
 * 
 * Safety guarantees:
 * - Every event gets a valid position (left >= 0, left < 100)
 * - Every event has visible width (width >= MIN_WIDTH)
 * - left + width <= 100 (no overflow)
 * - Zero-duration events are handled properly
 */
export function extractBlocks<T extends ICalendarEvent>(
  events: T[],
): CalendarEventVisual<T>[] {
  if (events.length === 0) return []

  // Create visuals and sort
  const visuals = events.map((event) => ({
    event,
    column: 0,
    columnCount: 1, // Default to 1 to prevent division by zero
    left: 0,
    width: WIDTH_FULL,
  }))

  visuals.sort((a, b) => {
    const aTimes = getEventTimes(a.event)
    const bTimes = getEventTimes(b.event)
    
    if (aTimes.start !== bTimes.start) return aTimes.start - bTimes.start

    // Longer events (larger duration) come first
    const aDuration = aTimes.end - aTimes.start
    const bDuration = bTimes.end - bTimes.start
    return bDuration - aDuration
  })

  // Store all overlap groups to process later
  const allGroups: { groups: ColumnGroup<T>[]; visuals: CalendarEventVisual<T>[] }[] = []
  
  let groups: ColumnGroup<T>[] = []
  let groupVisuals: CalendarEventVisual<T>[] = []
  let globalMin = -1
  let globalMax = -1

  // First pass: assign columns and collect groups
  for (const visual of visuals) {
    const { start, end } = getEventTimes(visual.event)

    // Check if this event overlaps with the current group's time range
    if (groups.length > 0 && !hasOverlap(start, end, globalMin, globalMax)) {
      // No overlap - save current group and start fresh
      allGroups.push({ groups, visuals: groupVisuals })
      groups = []
      groupVisuals = []
      globalMin = -1
      globalMax = -1
    }

    // Find first available column
    let targetColumn = getOpenColumn(groups, start, end)

    if (targetColumn === -1) {
      // Need a new column
      targetColumn = groups.length
      groups.push({
        start,
        end,
        visuals: [],
      })
    }

    const target = groups[targetColumn]!
    target.visuals.push(visual)
    target.start = Math.min(target.start, start)
    target.end = Math.max(target.end, end)
    visual.column = targetColumn
    groupVisuals.push(visual)

    // Update global time range
    if (globalMin === -1) {
      globalMin = start
      globalMax = end
    } else {
      globalMin = Math.min(globalMin, start)
      globalMax = Math.max(globalMax, end)
    }
  }

  // Save the last group
  if (groups.length > 0) {
    allGroups.push({ groups, visuals: groupVisuals })
  }

  // Second pass: calculate columnCount, left, and width for each group
  for (const { groups: g, visuals: gVisuals } of allGroups) {
    const columnCount = Math.max(1, g.length) // Ensure at least 1
    
    for (const visual of gVisuals) {
      visual.columnCount = columnCount
      
      const { start, end } = getEventTimes(visual.event)
      const span = getColumnSpan(g, start, end, visual.column)
      
      // Calculate raw values
      let left = (visual.column * WIDTH_FULL) / columnCount
      let width = (span * WIDTH_FULL) / columnCount
      
      // Apply safety constraints
      left = clamp(left, 0, WIDTH_FULL - MIN_WIDTH)
      width = clamp(width, MIN_WIDTH, WIDTH_FULL - left)
      
      visual.left = left
      visual.width = width
    }
  }

  return visuals
}
