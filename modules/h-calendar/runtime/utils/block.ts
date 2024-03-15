import type { ICalendarEvent } from '../types'

export const extractBlocks = <T extends ICalendarEvent>(events: T[]) => {
  const groups: T[][] = []
  const visited = new Set()
  const internalEvents = events.sort((a, b) => {
    if (a.start < b.start) return -1
    if (a.start > b.start) return 1
    if (a.end < b.end) return 1
    if (a.end > b.end) return -1
    return 0
  })
  for (let i = 0; i < internalEvents.length; i++) {
    if (visited.has(i)) continue
    const event = events[i]
    const group: T[] = [event]
    for (let j = i + 1; j < internalEvents.length; j++) {
      const nextEvent = events[j]
      if (
        event.start < nextEvent.end &&
        event.end > nextEvent.start &&
        !visited.has(j)
      ) {
        group.push(nextEvent)
        visited.add(j)
      }
    }
    groups.push(group)
  }

  return groups
}
