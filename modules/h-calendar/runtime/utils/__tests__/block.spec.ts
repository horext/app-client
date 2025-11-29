import { extractBlocks, type CalendarEventVisual } from '../block'
import type { ICalendarEvent } from '../../types'
import { describe, expect, it } from 'vitest'

describe('extractBlocks', () => {
  it('should group overlapping events correctly with layout info', () => {
    const events: ICalendarEvent[] = [
      {
        id: '2',
        weekDay: 1,
        start: '09:30',
        end: '10:30',
        name: 'Event 2',
      },
      {
        id: '3',
        weekDay: 1,
        start: '10:00',
        end: '11:00',
        name: 'Event 3',
      },
      {
        id: '1',
        weekDay: 1,
        start: '09:00',
        end: '10:00',
        name: 'Event 1',
      },
      {
        id: '4',
        weekDay: 1,
        start: '11:00',
        end: '12:00',
        name: 'Event 4',
      },
    ]

    const visuals = extractBlocks(events)

    // Should return flat array of visuals with layout info
    expect(visuals).toHaveLength(4)

    // Event 1 (09:00-10:00) - first column, overlaps with Event 2
    const event1 = visuals.find((v) => v.event.id === '1')!
    expect(event1.column).toBe(0)
    expect(event1.columnCount).toBe(2)
    expect(event1.left).toBe(0)
    expect(event1.width).toBe(50)

    // Event 2 (09:30-10:30) - second column, overlaps with Event 1
    const event2 = visuals.find((v) => v.event.id === '2')!
    expect(event2.column).toBe(1)
    expect(event2.columnCount).toBe(2)
    expect(event2.left).toBe(50)
    expect(event2.width).toBe(50)

    // Event 3 (10:00-11:00) - reuses first column after Event 1 ends
    // It overlaps with Event 2, so they share columns
    const event3 = visuals.find((v) => v.event.id === '3')!
    expect(event3.column).toBe(0)
    expect(event3.columnCount).toBe(2)

    // Event 4 (11:00-12:00) - standalone, full width
    const event4 = visuals.find((v) => v.event.id === '4')!
    expect(event4.column).toBe(0)
    expect(event4.columnCount).toBe(1)
    expect(event4.left).toBe(0)
    expect(event4.width).toBe(100)
  })

  it('should return empty array for no events', () => {
    const visuals = extractBlocks([])
    expect(visuals).toEqual([])
  })

  it('should handle single event correctly', () => {
    const events: ICalendarEvent[] = [
      {
        id: '1',
        weekDay: 1,
        start: '09:00',
        end: '10:00',
        name: 'Single Event',
      },
    ]

    const visuals = extractBlocks(events)

    expect(visuals).toHaveLength(1)
    expect(visuals[0]!.column).toBe(0)
    expect(visuals[0]!.columnCount).toBe(1)
    expect(visuals[0]!.left).toBe(0)
    expect(visuals[0]!.width).toBe(100)
  })

  it('should handle non-overlapping events correctly', () => {
    const events: ICalendarEvent[] = [
      {
        id: '1',
        weekDay: 1,
        start: '09:00',
        end: '10:00',
        name: 'Event 1',
      },
      {
        id: '2',
        weekDay: 1,
        start: '11:00',
        end: '12:00',
        name: 'Event 2',
      },
    ]

    const visuals = extractBlocks(events)

    expect(visuals).toHaveLength(2)
    // Both events should have full width since they don't overlap
    expect(visuals[0]!.width).toBe(100)
    expect(visuals[1]!.width).toBe(100)
  })
})
