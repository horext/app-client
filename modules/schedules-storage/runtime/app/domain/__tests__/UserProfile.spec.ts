import { describe, it, expect } from 'vitest'
import { UserProfile } from '../UserProfile'

describe('UserProfile', () => {
  describe('create', () => {
    it('creates with provided values and default setupCompleted=false', () => {
      const profile = UserProfile.create({ facultyId: 1, specialityId: 2 })
      expect(profile.id).toBe('profile')
      expect(profile.facultyId).toBe(1)
      expect(profile.specialityId).toBe(2)
      expect(profile.setupCompleted).toBe(false)
    })

    it('creates with setupCompleted=true when provided', () => {
      const profile = UserProfile.create({
        facultyId: 1,
        specialityId: 2,
        setupCompleted: true,
      })
      expect(profile.setupCompleted).toBe(true)
    })
  })

  describe('from', () => {
    it('creates UserProfile from data', () => {
      const data = {
        id: 'profile' as const,
        facultyId: 3,
        specialityId: 4,
        setupCompleted: true,
      }
      const profile = UserProfile.from(data)
      expect(profile.id).toBe('profile')
      expect(profile.facultyId).toBe(3)
      expect(profile.specialityId).toBe(4)
      expect(profile.setupCompleted).toBe(true)
    })
  })

  describe('patch', () => {
    it('patches facultyId', () => {
      const profile = UserProfile.create({ facultyId: 1, specialityId: 2 })
      const patched = profile.patch({ facultyId: 10 })
      expect(patched.facultyId).toBe(10)
      expect(patched.specialityId).toBe(2)
    })

    it('patches specialityId', () => {
      const profile = UserProfile.create({ facultyId: 1, specialityId: 2 })
      const patched = profile.patch({ specialityId: 20 })
      expect(patched.specialityId).toBe(20)
    })

    it('patches setupCompleted', () => {
      const profile = UserProfile.create({ facultyId: 1, specialityId: 2 })
      const patched = profile.patch({ setupCompleted: true })
      expect(patched.setupCompleted).toBe(true)
    })

    it('keeps existing values when facultyId is undefined in partial', () => {
      const profile = UserProfile.create({ facultyId: 5, specialityId: 7 })
      const patched = profile.patch({})
      expect(patched.facultyId).toBe(5)
      expect(patched.specialityId).toBe(7)
    })

    it('allows patching facultyId to 0', () => {
      const profile = UserProfile.create({ facultyId: 5, specialityId: 7 })
      const patched = profile.patch({ facultyId: 0 })
      expect(patched.facultyId).toBe(0)
    })

    it('allows patching specialityId to 0', () => {
      const profile = UserProfile.create({ facultyId: 5, specialityId: 7 })
      const patched = profile.patch({ specialityId: 0 })
      expect(patched.specialityId).toBe(0)
    })
  })

  describe('toData', () => {
    it('converts to plain object', () => {
      const profile = UserProfile.create({ facultyId: 1, specialityId: 2 })
      const data = profile.toData()
      expect(data).toEqual({
        id: 'profile',
        facultyId: 1,
        specialityId: 2,
        setupCompleted: false,
      })
    })
  })
})
