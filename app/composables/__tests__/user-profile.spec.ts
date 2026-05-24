import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref, computed } from 'vue'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IUserProfile } from '~/interfaces/profile'

import { useUserProfile } from '../user-profile'

const mockProfile = ref<IUserProfile | undefined>(undefined)
const mockHourlyLoad = ref<IHourlyLoad | undefined>(undefined)
const mockIsNewHourlyLoad = ref(false)
const mockIsUpdateHourlyLoad = ref(false)
const mockLoadingProfile = ref(true)
const mockSetupCompleted = computed(
  () => !mockLoadingProfile.value && !!mockProfile.value,
)
const mockFacultyId = computed(() => mockProfile.value?.facultyId)
const mockSpecialityId = computed(() => mockProfile.value?.specialityId)

const mockGetProfile = vi.fn()
const mockProfilePatch = vi.fn()
const mockCreateProfile = vi.fn()

const mockGetAcademicConfig = vi.fn()
const mockAcademicPatch = vi.fn()
const mockCreateAcademicConfig = vi.fn()

const mockGetLatestByFaculty = vi.fn()

const mockCreatePreferences = vi.fn()

mockNuxtImport('useUserProfileStore', () =>
  vi.fn(() => ({
    profile: mockProfile,
    hourlyLoad: mockHourlyLoad,
    isNewHourlyLoad: mockIsNewHourlyLoad,
    isUpdateHourlyLoad: mockIsUpdateHourlyLoad,
    setupCompleted: mockSetupCompleted,
    facultyId: mockFacultyId,
    specialityId: mockSpecialityId,
    loadingProfile: mockLoadingProfile,
  })),
)

mockNuxtImport('useProfileService', () =>
  vi.fn(() => ({
    getProfile: mockGetProfile,
    patch: mockProfilePatch,
    createProfile: mockCreateProfile,
  })),
)

mockNuxtImport('useAcademicConfigService', () =>
  vi.fn(() => ({
    getAcademicConfig: mockGetAcademicConfig,
    patch: mockAcademicPatch,
    createAcademicConfig: mockCreateAcademicConfig,
  })),
)

mockNuxtImport('useUserPreferences', () =>
  vi.fn(() => ({
    createPreferences: mockCreatePreferences,
  })),
)

vi.mock('~~/modules/apis/runtime/composables', () => ({
  useHourlyLoadApi: vi.fn(() => ({
    getLatestByFaculty: mockGetLatestByFaculty,
  })),
}))

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

function makeHourlyLoad(id = 1): IHourlyLoad {
  return { id, updatedAt: '2024-01-01T00:00:00Z' } as IHourlyLoad
}

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockProfile.value = undefined
    mockHourlyLoad.value = undefined
    mockIsNewHourlyLoad.value = false
    mockIsUpdateHourlyLoad.value = false
    mockLoadingProfile.value = true
  })

  it('returns all expected properties and functions', () => {
    const result = useUserProfile()
    expect(result.profile).toBeDefined()
    expect(result.hourlyLoad).toBeDefined()
    expect(result.fetchProfile).toBeTypeOf('function')
    expect(result.fetchAcademicConfig).toBeTypeOf('function')
    expect(result.updateHourlyLoad).toBeTypeOf('function')
    expect(result.updateFaculty).toBeTypeOf('function')
    expect(result.updateSpeciality).toBeTypeOf('function')
    expect(result.updateSetupCompleted).toBeTypeOf('function')
    expect(result.updateBasicSettings).toBeTypeOf('function')
    expect(result.completeSetup).toBeTypeOf('function')
    expect(result.fetchLatestHourlyLoad).toBeTypeOf('function')
  })

  it('fetchProfile sets profile and toggles loadingProfile', async () => {
    const profile = {
      id: 'p1',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    }
    mockGetProfile.mockResolvedValue(profile)
    const { fetchProfile } = useUserProfile()
    await fetchProfile()
    expect(mockProfile.value).toEqual(profile)
    expect(mockLoadingProfile.value).toBe(false)
  })

  it('fetchProfile sets loadingProfile to false even if getProfile throws', async () => {
    mockGetProfile.mockRejectedValue(new Error('network error'))
    const { fetchProfile } = useUserProfile()
    await expect(fetchProfile()).rejects.toThrow('network error')
    expect(mockLoadingProfile.value).toBe(false)
  })

  it('fetchAcademicConfig sets hourlyLoad when config has one', async () => {
    const hourlyLoad = makeHourlyLoad()
    mockGetAcademicConfig.mockResolvedValue({ hourlyLoad })
    const { fetchAcademicConfig } = useUserProfile()
    await fetchAcademicConfig()
    expect(mockHourlyLoad.value).toEqual(hourlyLoad)
  })

  it('fetchAcademicConfig does not set hourlyLoad when config has none', async () => {
    mockGetAcademicConfig.mockResolvedValue({})
    const { fetchAcademicConfig } = useUserProfile()
    await fetchAcademicConfig()
    expect(mockHourlyLoad.value).toBeUndefined()
  })

  it('updateHourlyLoad sets isNewHourlyLoad when id differs', async () => {
    mockHourlyLoad.value = makeHourlyLoad(1)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(2))
    expect(mockIsNewHourlyLoad.value).toBe(true)
  })

  it('updateHourlyLoad sets isUpdateHourlyLoad when id same but updatedAt differs', async () => {
    mockHourlyLoad.value = { id: 1, updatedAt: '2024-01-01' } as IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad({ id: 1, updatedAt: '2024-06-01' } as IHourlyLoad)
    expect(mockIsUpdateHourlyLoad.value).toBe(true)
  })

  it('updateHourlyLoad does not set flags when id same and updatedAt same', async () => {
    mockHourlyLoad.value = { id: 1, updatedAt: '2024-01-01' } as IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad({ id: 1, updatedAt: '2024-01-01' } as IHourlyLoad)
    expect(mockIsNewHourlyLoad.value).toBe(false)
    expect(mockIsUpdateHourlyLoad.value).toBe(false)
  })

  it('updateHourlyLoad skips flag logic when currentHourlyLoad has no id', async () => {
    mockHourlyLoad.value = { updatedAt: '2024-01-01' } as IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(1))
    expect(mockIsNewHourlyLoad.value).toBe(false)
  })

  it('updateHourlyLoad works when hourlyLoad is undefined', async () => {
    mockHourlyLoad.value = undefined
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(1))
    expect(mockHourlyLoad.value).toEqual(makeHourlyLoad(1))
  })

  it('fetchLatestHourlyLoad calls API and updates hourlyLoad', async () => {
    const load = makeHourlyLoad(5)
    mockGetLatestByFaculty.mockResolvedValue(load)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { fetchLatestHourlyLoad } = useUserProfile()
    await fetchLatestHourlyLoad(10)
    expect(mockGetLatestByFaculty).toHaveBeenCalledWith(10)
    expect(mockHourlyLoad.value).toEqual(load)
  })

  it('updateFaculty patches service and updates profile facultyId', async () => {
    mockProfile.value = {
      id: 'profile',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    }
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateFaculty } = useUserProfile()
    await updateFaculty(5)
    expect(mockProfilePatch).toHaveBeenCalledWith({ facultyId: 5 })
    expect(mockProfile.value?.facultyId).toBe(5)
  })

  it('updateFaculty patches service even when profile is undefined', async () => {
    mockProfile.value = undefined
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateFaculty } = useUserProfile()
    await updateFaculty(5)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateSpeciality patches service and updates profile specialityId', async () => {
    mockProfile.value = {
      id: 'profile',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    }
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSpeciality } = useUserProfile()
    await updateSpeciality(7)
    expect(mockProfile.value?.specialityId).toBe(7)
  })

  it('updateSpeciality patches even when profile is undefined', async () => {
    mockProfile.value = undefined
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSpeciality } = useUserProfile()
    await updateSpeciality(7)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateSetupCompleted patches service and updates profile', async () => {
    mockProfile.value = {
      id: 'profile',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    }
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSetupCompleted } = useUserProfile()
    await updateSetupCompleted(true)
    expect(mockProfile.value?.setupCompleted).toBe(true)
  })

  it('updateSetupCompleted patches even when profile is undefined', async () => {
    mockProfile.value = undefined
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSetupCompleted } = useUserProfile()
    await updateSetupCompleted(true)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateBasicSettings patches profile and hourlyLoad, then updates profile', async () => {
    const load = makeHourlyLoad(1)
    mockProfile.value = {
      id: 'profile',
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    }
    mockProfilePatch.mockResolvedValue(undefined)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateBasicSettings } = useUserProfile()
    await updateBasicSettings(3, 4, load)
    expect(mockProfile.value?.facultyId).toBe(3)
    expect(mockProfile.value?.specialityId).toBe(4)
  })

  it('updateBasicSettings works when profile is undefined', async () => {
    const load = makeHourlyLoad(1)
    mockProfile.value = undefined
    mockProfilePatch.mockResolvedValue(undefined)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateBasicSettings } = useUserProfile()
    await updateBasicSettings(3, 4, load)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('completeSetup creates profile, academic config, preferences, and sets store values', async () => {
    const load = makeHourlyLoad(1)
    mockCreateProfile.mockResolvedValue(undefined)
    mockCreateAcademicConfig.mockResolvedValue(undefined)
    mockCreatePreferences.mockResolvedValue(undefined)
    const { completeSetup } = useUserProfile()
    await completeSetup(2, 3, load)
    expect(mockCreateProfile).toHaveBeenCalled()
    expect(mockCreateAcademicConfig).toHaveBeenCalled()
    expect(mockCreatePreferences).toHaveBeenCalled()
    expect(mockProfile.value?.facultyId).toBe(2)
    expect(mockHourlyLoad.value).toEqual(load)
  })
})
