import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import timeout from '../functions'

describe('timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves after the specified milliseconds', async () => {
    const promise = timeout(100)
    vi.advanceTimersByTime(100)
    await expect(promise).resolves.toBeUndefined()
  })

  it('resolves with undefined when ms is undefined', async () => {
    const promise = timeout(undefined)
    vi.advanceTimersByTime(0)
    await expect(promise).resolves.toBeUndefined()
  })

  it('does not resolve before the specified time elapses', async () => {
    let resolved = false
    timeout(500).then(() => {
      resolved = true
    })
    vi.advanceTimersByTime(499)
    await Promise.resolve()
    expect(resolved).toBe(false)
    vi.advanceTimersByTime(1)
    await Promise.resolve()
    expect(resolved).toBe(true)
  })

  it('returns a Promise', () => {
    const result = timeout(10)
    expect(result).toBeInstanceOf(Promise)
    vi.advanceTimersByTime(10)
  })
})
