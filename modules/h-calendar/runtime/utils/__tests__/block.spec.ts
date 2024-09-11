import { extractBlocks } from '../block'
import type { ICalendarEvent } from '../../types'
import { describe, expect, it } from 'vitest'

describe('extractBlocks', () => {
  it('should group overlapping events correctly', () => {
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

    const groups = extractBlocks(events)

    expect(groups).toEqual([
      [
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
          start: '09:30',
          end: '10:30',
          name: 'Event 2',
        },
      ],
      [
        {
          id: '3',
          weekDay: 1,
          start: '10:00',
          end: '11:00',
          name: 'Event 3',
        },
      ],
      [
        {
          id: '4',
          weekDay: 1,
          start: '11:00',
          end: '12:00',
          name: 'Event 4',
        },
      ],
    ])
  })
})
