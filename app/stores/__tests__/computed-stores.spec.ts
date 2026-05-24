import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import { useUserProfileStore } from '~/stores/user-profile'

describe('useUserPreferencesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns default weekDays when preferences not set', () => {
    const store = useUserPreferencesStore()
    expect(store.weekDays).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('returns default crossings=0 when preferences not set', () => {
    const store = useUserPreferencesStore()
    expect(store.crossings).toBe(0)
  })

  it('returns default maxGenerationHistory=5 when preferences not set', () => {
    const store = useUserPreferencesStore()
    expect(store.maxGenerationHistory).toBe(5)
  })

  it('returns weekDays from preferences when set', () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      weekDays: [1, 2, 3],
      crossings: 1,
      maxGenerationHistory: 10,
    }
    expect(store.weekDays).toEqual([1, 2, 3])
  })

  it('returns crossings from preferences when set', () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      weekDays: [0],
      crossings: 3,
      maxGenerationHistory: 5,
    }
    expect(store.crossings).toBe(3)
  })

  it('returns maxGenerationHistory from preferences when set', () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      weekDays: [0],
      crossings: 0,
      maxGenerationHistory: 20,
    }
    expect(store.maxGenerationHistory).toBe(20)
  })
})

describe('useUserProfileStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with loadingProfile=true and no profile', () => {
    const store = useUserProfileStore()
    expect(store.loadingProfile).toBe(true)
    expect(store.profile).toBeUndefined()
  })

  it('setupCompleted is false when still loading', () => {
    const store = useUserProfileStore()
    expect(store.setupCompleted).toBe(false)
  })

  it('setupCompleted is true when loadingProfile=false and profile is set', () => {
    const store = useUserProfileStore()
    store.loadingProfile = false
    store.profile = {
      id: 'profile',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: true,
    }
    expect(store.setupCompleted).toBe(true)
  })

  it('setupCompleted is false when loadingProfile=false but no profile', () => {
    const store = useUserProfileStore()
    store.loadingProfile = false
    expect(store.setupCompleted).toBe(false)
  })

  it('facultyId returns from profile', () => {
    const store = useUserProfileStore()
    store.profile = {
      id: 'profile',
      facultyId: 5,
      specialityId: 7,
      setupCompleted: true,
    }
    expect(store.facultyId).toBe(5)
  })

  it('specialityId returns from profile', () => {
    const store = useUserProfileStore()
    store.profile = {
      id: 'profile',
      facultyId: 5,
      specialityId: 7,
      setupCompleted: true,
    }
    expect(store.specialityId).toBe(7)
  })
})
