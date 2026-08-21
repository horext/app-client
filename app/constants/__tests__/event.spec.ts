import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SUBJECT_COLOR,
  EVENT_COLORS,
  getEventColorByIndex,
  getNextAvailableEventColor,
} from '../event'

describe('getEventColorByIndex', () => {
  it('returns a palette color by index', () => {
    expect(getEventColorByIndex(2)).toBe(EVENT_COLORS[2])
  })

  it('uses the default after the palette is exhausted', () => {
    expect(getEventColorByIndex(EVENT_COLORS.length)).toBe(
      DEFAULT_SUBJECT_COLOR,
    )
  })
})

describe('getNextAvailableEventColor', () => {
  it('returns the first unused palette color instead of using the item count', () => {
    const usedColors = [EVENT_COLORS[0], EVENT_COLORS[2]]

    expect(getNextAvailableEventColor(usedColors)).toBe(EVENT_COLORS[1])
  })

  it('uses the default color after the palette is exhausted', () => {
    const nextColor = getNextAvailableEventColor(EVENT_COLORS)

    expect(nextColor).toBe(DEFAULT_SUBJECT_COLOR)
  })
})
