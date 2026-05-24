import { describe, it, expect } from 'vitest'
import { mouseEventDayToMinutes, getHours, roundTime } from '../interval'

describe('mouseEventDayToMinutes', () => {
  it('calculates minutes from mouse position using defaults', () => {
    const bounds = {
      top: 0,
      left: 0,
      right: 100,
      bottom: 500,
      width: 100,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
    const mockEl = {
      getBoundingClientRect: () => bounds,
    } as HTMLElement

    const event = {
      currentTarget: mockEl,
      clientY: 2.5, // one interval height (2.5rem = 2.5px in test env)
    } as unknown as MouseEvent

    // startHour=8, baseMinutes=480, addIntervals=2.5/2.5=1, addMinutes=floor(1*60)=60
    // minutes = 480 + 60 = 540
    const result = mouseEventDayToMinutes(event, {
      startHour: 8,
      intervalMinutes: 60,
      intervalHeight: 2.5,
    })
    expect(result).toBe(540)
  })

  it('returns just baseMinutes when clientY equals top', () => {
    const bounds = {
      top: 100,
      left: 0,
      right: 100,
      bottom: 500,
      width: 100,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
    const mockEl = { getBoundingClientRect: () => bounds } as HTMLElement
    const event = {
      currentTarget: mockEl,
      clientY: 100,
    } as unknown as MouseEvent

    // startHour=7, baseMinutes=420, clientY-top=0, addMinutes=0
    const result = mouseEventDayToMinutes(event, {
      startHour: 7,
      intervalMinutes: 30,
      intervalHeight: 2.5,
    })
    expect(result).toBe(7 * 60)
  })
})

describe('getHours', () => {
  it('returns correct number of hours between start and end with 60-min intervals', () => {
    const hours = getHours(8, 10, 60)
    expect(hours).toEqual(['08:00', '09:00'])
  })

  it('returns sub-hour intervals', () => {
    const hours = getHours(8, 9, 30)
    expect(hours).toEqual(['08:00', '08:30'])
  })

  it('returns empty array when startHour equals endHour', () => {
    const hours = getHours(10, 10, 60)
    expect(hours).toEqual([])
  })

  it('uses default parameters (8 to 24, 60 min)', () => {
    const hours = getHours()
    expect(hours.length).toBe(16)
    expect(hours[0]).toBe('08:00')
    expect(hours[hours.length - 1]).toBe('23:00')
  })
})

describe('roundTime', () => {
  it('rounds down to nearest 15 minutes by default', () => {
    // 67 min = 1h 7min, rounded down to nearest 15 = 60
    expect(roundTime(67)).toBe(60)
  })

  it('rounds down when down=true', () => {
    expect(roundTime(90, true)).toBe(90) // 90 % 15 == 0
    expect(roundTime(91, true)).toBe(90) // 91 - 1 = 90
  })

  it('rounds up when down=false', () => {
    // 90 % 15 == 0, so roundDownTime - 0 = 15, result = 90 + 15 = 105
    expect(roundTime(90, false)).toBe(105)
    expect(roundTime(91, false)).toBe(105) // 91 + (15 - 1) = 105
  })

  it('handles time that is already aligned when rounding up', () => {
    // 60 % 15 = 0, so roundUp: 60 + (15 - 0) = 75
    expect(roundTime(60, false)).toBe(75)
  })

  it('handles 0 time', () => {
    expect(roundTime(0, true)).toBe(0)
    expect(roundTime(0, false)).toBe(15)
  })
})
