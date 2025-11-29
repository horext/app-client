import { extractBlocks, type CalendarEventVisual } from '../block'
import type { ICalendarEvent } from '../../types'
import { describe, expect, it } from 'vitest'

/**
 * Helper to validate that all events are visible and properly positioned.
 * This ensures no events are hidden due to bad calculations.
 */
function assertAllEventsVisible(visuals: CalendarEventVisual<ICalendarEvent>[]) {
  for (const visual of visuals) {
    // Left must be valid (0 <= left < 100)
    expect(visual.left).toBeGreaterThanOrEqual(0)
    expect(visual.left).toBeLessThan(100)
    
    // Width must be visible (> 0, ideally >= 10)
    expect(visual.width).toBeGreaterThan(0)
    expect(visual.width).toBeGreaterThanOrEqual(10)
    
    // Left + width must not overflow
    expect(visual.left + visual.width).toBeLessThanOrEqual(100)
    
    // Column count must be valid
    expect(visual.columnCount).toBeGreaterThanOrEqual(1)
    
    // Column index must be valid
    expect(visual.column).toBeGreaterThanOrEqual(0)
    expect(visual.column).toBeLessThan(visual.columnCount)
    
    // No NaN or undefined values
    expect(Number.isFinite(visual.left)).toBe(true)
    expect(Number.isFinite(visual.width)).toBe(true)
    expect(Number.isFinite(visual.column)).toBe(true)
    expect(Number.isFinite(visual.columnCount)).toBe(true)
  }
}

/**
 * Helper to check that no two overlapping events occupy the same visual space
 */
function assertNoVisualOverlap(visuals: CalendarEventVisual<ICalendarEvent>[]) {
  for (let i = 0; i < visuals.length; i++) {
    for (let j = i + 1; j < visuals.length; j++) {
      const a = visuals[i]!
      const b = visuals[j]!
      
      // Check if events overlap in time
      const aStart = timeToMinutes(a.event.start)
      const aEnd = timeToMinutes(a.event.end)
      const bStart = timeToMinutes(b.event.start)
      const bEnd = timeToMinutes(b.event.end)
      
      const timeOverlap = !(aStart >= bEnd || aEnd <= bStart)
      
      if (timeOverlap) {
        // If times overlap, positions should not fully overlap
        const aRight = a.left + a.width
        const bRight = b.left + b.width
        
        // They can share edges but not fully overlap
        const visualOverlap = !(a.left >= bRight || aRight <= b.left)
        
        // If they visually overlap, at least one should have partial width
        if (visualOverlap) {
          expect(a.width < 100 || b.width < 100).toBe(true)
        }
      }
    }
  }
}

function timeToMinutes(time: string): number {
  const parts = time.split(':')
  return Number(parts[0] ?? 0) * 60 + Number(parts[1] ?? 0)
}

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
    assertAllEventsVisible(visuals)

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
    assertAllEventsVisible(visuals)
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
    assertAllEventsVisible(visuals)
    // Both events should have full width since they don't overlap
    expect(visuals[0]!.width).toBe(100)
    expect(visuals[1]!.width).toBe(100)
  })

  // ==================== EDGE CASE TESTS ====================

  describe('edge cases - no hidden events', () => {
    it('should handle many overlapping events (stress test)', () => {
      const events: ICalendarEvent[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        weekDay: 1,
        start: '09:00',
        end: '10:00',
        name: `Event ${i}`,
      }))

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(10)
      assertAllEventsVisible(visuals)
      
      // All events should have equal width
      const expectedWidth = 100 / 10
      for (const visual of visuals) {
        expect(visual.width).toBeCloseTo(expectedWidth, 1)
      }
    })

    it('should handle zero-duration events', () => {
      const events: ICalendarEvent[] = [
        {
          id: '1',
          weekDay: 1,
          start: '09:00',
          end: '09:00', // Zero duration
          name: 'Zero Duration',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(1)
      assertAllEventsVisible(visuals)
    })

    it('should handle events with end before start (invalid)', () => {
      const events: ICalendarEvent[] = [
        {
          id: '1',
          weekDay: 1,
          start: '10:00',
          end: '09:00', // End before start
          name: 'Invalid Duration',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(1)
      assertAllEventsVisible(visuals)
    })

    it('should handle events with same start and end times (multiple)', () => {
      const events: ICalendarEvent[] = [
        {
          id: '1',
          weekDay: 1,
          start: '09:00',
          end: '09:00',
          name: 'Event 1',
        },
        {
          id: '2',
          weekDay: 1,
          start: '09:00',
          end: '09:00',
          name: 'Event 2',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(2)
      assertAllEventsVisible(visuals)
    })

    it('should handle events that barely touch (no overlap)', () => {
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
          start: '10:00',
          end: '11:00',
          name: 'Event 2',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(2)
      assertAllEventsVisible(visuals)
      // Should be treated as separate groups (no overlap)
      expect(visuals[0]!.width).toBe(100)
      expect(visuals[1]!.width).toBe(100)
    })

    it('should handle cascading overlaps (A overlaps B, B overlaps C, but not A-C)', () => {
      const events: ICalendarEvent[] = [
        {
          id: 'A',
          weekDay: 1,
          start: '09:00',
          end: '10:00',
          name: 'Event A',
        },
        {
          id: 'B',
          weekDay: 1,
          start: '09:30',
          end: '10:30',
          name: 'Event B',
        },
        {
          id: 'C',
          weekDay: 1,
          start: '10:00',
          end: '11:00',
          name: 'Event C',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(3)
      assertAllEventsVisible(visuals)
      assertNoVisualOverlap(visuals)
    })

    it('should handle tall event with multiple short events', () => {
      const events: ICalendarEvent[] = [
        {
          id: 'tall',
          weekDay: 1,
          start: '08:00',
          end: '12:00',
          name: 'Tall Event',
        },
        {
          id: 'short1',
          weekDay: 1,
          start: '08:00',
          end: '09:00',
          name: 'Short 1',
        },
        {
          id: 'short2',
          weekDay: 1,
          start: '09:00',
          end: '10:00',
          name: 'Short 2',
        },
        {
          id: 'short3',
          weekDay: 1,
          start: '10:00',
          end: '11:00',
          name: 'Short 3',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(4)
      assertAllEventsVisible(visuals)
      
      // Tall event should be in column 0
      const tall = visuals.find((v) => v.event.id === 'tall')!
      expect(tall.column).toBe(0)
      
      // Short events can reuse column 1
      const short1 = visuals.find((v) => v.event.id === 'short1')!
      const short2 = visuals.find((v) => v.event.id === 'short2')!
      const short3 = visuals.find((v) => v.event.id === 'short3')!
      
      expect(short1.column).toBe(1)
      expect(short2.column).toBe(1)
      expect(short3.column).toBe(1)
    })

    it('should handle event after tall event that can span multiple columns', () => {
      const events: ICalendarEvent[] = [
        {
          id: 'tall',
          weekDay: 1,
          start: '08:00',
          end: '10:00',
          name: 'Tall Event',
        },
        {
          id: 'short1',
          weekDay: 1,
          start: '08:00',
          end: '09:00',
          name: 'Short 1',
        },
        {
          id: 'short2',
          weekDay: 1,
          start: '08:00',
          end: '09:00',
          name: 'Short 2',
        },
        {
          id: 'after',
          weekDay: 1,
          start: '09:00',
          end: '10:00',
          name: 'After Short Events',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(4)
      assertAllEventsVisible(visuals)
      
      // 'after' event should be able to span columns 1 and 2
      const after = visuals.find((v) => v.event.id === 'after')!
      expect(after.column).toBe(1)
      expect(after.width).toBeCloseTo(66.67, 0) // 2/3 of 100
    })

    it('should handle invalid time formats gracefully', () => {
      const events: ICalendarEvent[] = [
        {
          id: '1',
          weekDay: 1,
          start: 'invalid',
          end: 'also-invalid',
          name: 'Invalid Times',
        },
        {
          id: '2',
          weekDay: 1,
          start: '',
          end: '',
          name: 'Empty Times',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(2)
      assertAllEventsVisible(visuals)
    })

    it('should handle midnight crossing times', () => {
      const events: ICalendarEvent[] = [
        {
          id: '1',
          weekDay: 1,
          start: '23:00',
          end: '23:59',
          name: 'Late Night',
        },
        {
          id: '2',
          weekDay: 1,
          start: '00:00',
          end: '01:00',
          name: 'Early Morning',
        },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(2)
      assertAllEventsVisible(visuals)
    })

    it('should output same number of visuals as input events', () => {
      const events: ICalendarEvent[] = [
        { id: '1', weekDay: 1, start: '09:00', end: '10:00', name: 'E1' },
        { id: '2', weekDay: 1, start: '09:00', end: '10:00', name: 'E2' },
        { id: '3', weekDay: 1, start: '09:00', end: '10:00', name: 'E3' },
        { id: '4', weekDay: 1, start: '10:00', end: '11:00', name: 'E4' },
        { id: '5', weekDay: 1, start: '12:00', end: '13:00', name: 'E5' },
      ]

      const visuals = extractBlocks(events)

      // Most important: no events are lost
      expect(visuals).toHaveLength(events.length)
      assertAllEventsVisible(visuals)
      
      // Every input event should have a corresponding visual
      for (const event of events) {
        const visual = visuals.find((v) => v.event.id === event.id)
        expect(visual).toBeDefined()
      }
    })

    it('should handle extremely short gaps between events', () => {
      const events: ICalendarEvent[] = [
        { id: '1', weekDay: 1, start: '09:00', end: '09:01', name: 'E1' },
        { id: '2', weekDay: 1, start: '09:01', end: '09:02', name: 'E2' },
        { id: '3', weekDay: 1, start: '09:02', end: '09:03', name: 'E3' },
      ]

      const visuals = extractBlocks(events)

      expect(visuals).toHaveLength(3)
      assertAllEventsVisible(visuals)
    })
  })
})
