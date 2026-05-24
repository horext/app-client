import { describe, it, expect } from 'vitest'
import { getSectionColor } from '../color'

describe('getSectionColor', () => {
  const validColors = ['blue', 'purple', 'orange', 'indigo', 'teal']

  it('returns a value from the predefined color list', () => {
    expect(validColors).toContain(getSectionColor('A'))
  })

  it('returns "blue" for "A" (charCode 65, 65 % 5 = 0)', () => {
    expect(getSectionColor('A')).toBe('blue')
  })

  it('returns "purple" for "B" (charCode 66, 66 % 5 = 1)', () => {
    expect(getSectionColor('B')).toBe('purple')
  })

  it('returns "orange" for "C" (charCode 67, 67 % 5 = 2)', () => {
    expect(getSectionColor('C')).toBe('orange')
  })

  it('returns "indigo" for "D" (charCode 68, 68 % 5 = 3)', () => {
    expect(getSectionColor('D')).toBe('indigo')
  })

  it('returns "teal" for "E" (charCode 69, 69 % 5 = 4)', () => {
    expect(getSectionColor('E')).toBe('teal')
  })

  it('is deterministic — same input always yields same output', () => {
    expect(getSectionColor('X')).toBe(getSectionColor('X'))
  })

  it('produces different colors for characters with different charCode % 5 values', () => {
    const colorA = getSectionColor('A') // 65 % 5 = 0
    const colorB = getSectionColor('B') // 66 % 5 = 1
    expect(colorA).not.toBe(colorB)
  })
})
