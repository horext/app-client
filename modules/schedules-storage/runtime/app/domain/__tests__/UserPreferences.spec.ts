import { describe, it, expect } from 'vitest'
import type { Weekdays } from '../../../shared/interfaces/event'
import { UserPreferences } from '../UserPreferences'

describe('UserPreferences', () => {
  describe('create', () => {
    it('creates default preferences', () => {
      const prefs = UserPreferences.create()
      expect(prefs.id).toBe('preferences')
      expect(prefs.weekDays).toEqual([0, 1, 2, 3, 4, 5, 6])
      expect(prefs.crossings).toBe(0)
      expect(prefs.maxGenerationHistory).toBe(5)
    })
  })

  describe('from', () => {
    it('returns undefined when data is undefined', () => {
      const result = UserPreferences.from(undefined)
      expect(result).toBeUndefined()
    })

    it('creates UserPreferences from data', () => {
      const data = {
        id: 'preferences' as const,
        weekDays: [1, 2] as Weekdays[],
        crossings: 1,
        maxGenerationHistory: 10,
      }
      const prefs = UserPreferences.from(data)
      expect(prefs).toBeDefined()
      expect(prefs!.id).toBe('preferences')
      expect(prefs!.weekDays).toEqual([1, 2])
      expect(prefs!.crossings).toBe(1)
      expect(prefs!.maxGenerationHistory).toBe(10)
    })
  })

  describe('patch', () => {
    it('patches weekDays', () => {
      const prefs = UserPreferences.create()
      const patched = prefs.patch({ weekDays: [1, 2, 3] })
      expect(patched.weekDays).toEqual([1, 2, 3])
      expect(patched.crossings).toBe(0)
    })

    it('patches crossings', () => {
      const prefs = UserPreferences.create()
      const patched = prefs.patch({ crossings: 2 })
      expect(patched.crossings).toBe(2)
    })

    it('patches maxGenerationHistory', () => {
      const prefs = UserPreferences.create()
      const patched = prefs.patch({ maxGenerationHistory: 20 })
      expect(patched.maxGenerationHistory).toBe(20)
    })

    it('keeps existing values for unpatched fields', () => {
      const prefs = UserPreferences.create()
      const patched = prefs.patch({})
      expect(patched.weekDays).toEqual(prefs.weekDays)
      expect(patched.crossings).toBe(prefs.crossings)
      expect(patched.maxGenerationHistory).toBe(prefs.maxGenerationHistory)
    })
  })

  describe('toData', () => {
    it('converts to plain object', () => {
      const prefs = UserPreferences.create()
      const data = prefs.toData()
      expect(data).toEqual({
        id: 'preferences',
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        crossings: 0,
        maxGenerationHistory: 5,
      })
    })
  })
})
