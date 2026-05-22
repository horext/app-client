import { describe, it, expect } from 'vitest'
import { isIntersects } from '../event'
import type { IInterval } from '~/interfaces/interval'

describe('isIntersects', () => {
  it('returns true when events fully overlap', () => {
    const a: IInterval = { start: '08:00', end: '10:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target partially overlaps the start of source', () => {
    const a: IInterval = { start: '07:00', end: '09:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target partially overlaps the end of source', () => {
    const a: IInterval = { start: '09:00', end: '11:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target is fully contained within source', () => {
    const a: IInterval = { start: '08:30', end: '09:30' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns false when target ends exactly when source starts (adjacent, no overlap)', () => {
    const a: IInterval = { start: '06:00', end: '08:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when source ends exactly when target starts (adjacent, no overlap)', () => {
    const a: IInterval = { start: '10:00', end: '12:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when events are completely separate (target before source)', () => {
    const a: IInterval = { start: '06:00', end: '07:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when events are completely separate (target after source)', () => {
    const a: IInterval = { start: '11:00', end: '12:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })
})
