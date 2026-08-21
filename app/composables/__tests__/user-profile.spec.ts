import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IUserProfile } from '~/interfaces/profile'
import { useUserProfileStore } from '~/stores/user-profile'
import type { IProfileService } from '#shared/application/interfaces/profile.service'
import type { IAcademicConfigService } from '#shared/application/interfaces/academic-config.service'

import { useUserProfile } from '../user-profile'
import type { IHourlyLoadApi } from '~~/modules/apis/runtime/resources/hourly-load'
import type { ISpecialityApi } from '~~/modules/apis/runtime/resources/speciality'

const mockGetProfile = vi.fn()
const mockProfilePatch = vi.fn()
const mockCreateProfile = vi.fn()

const mockGetAcademicConfig = vi.fn()
const mockAcademicPatch = vi.fn()
const mockCreateAcademicConfig = vi.fn()

const mockGetLatestByFaculty = vi.fn()

const mockCreatePreferences = vi.fn()

mockNuxtImport('useProfileService', () =>
  vi.fn(
    () =>
      ({
        get: mockGetProfile,
        patch: mockProfilePatch,
        create: mockCreateProfile,
      }) satisfies IProfileService,
  ),
)

mockNuxtImport('useAcademicConfigService', () =>
  vi.fn(
    () =>
      ({
        get: mockGetAcademicConfig,
        patch: mockAcademicPatch,
        create: mockCreateAcademicConfig,
      }) satisfies IAcademicConfigService,
  ),
)

mockNuxtImport('useUserPreferences', () =>
  vi.fn(() => ({
    createPreferences: mockCreatePreferences,
  })),
)

vi.mock('~~/modules/apis/runtime/composables', () => ({
  useHourlyLoadApi: vi.fn(
    () =>
      ({
        getLatestByFaculty: mockGetLatestByFaculty,
      }) satisfies IHourlyLoadApi,
  ),
  useSpecialityApi: vi.fn(
    () =>
      ({
        getAllByFaculty: vi.fn(),
        getById: vi.fn(),
      }) satisfies ISpecialityApi,
  ),
}))

function makeHourlyLoad(id = 1): IHourlyLoad {
  return {
    id,
    updatedAt: '2024-01-01T00:00:00Z',
    name: '',
    checkedAt: '',
    publishedAt: '',
    academicPeriodOrganizationUnit: {
      id: 0,
      fromDate: '',
      toDate: '',
      academicPeriod: {
        id: 0,
      },
      organizationUnit: {
        id: 0,
      },
    },
  } satisfies IHourlyLoad
}

describe('useUserProfile', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
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
      studyPlanId: null,
      setupCompleted: false,
    }
    mockGetProfile.mockResolvedValue(profile)
    const { fetchProfile } = useUserProfile()
    await fetchProfile()
    const store = useUserProfileStore()
    expect(store.profile).toEqual(profile)
    expect(store.loadingProfile).toBe(false)
  })

  it('fetchProfile sets loadingProfile to false even if getProfile throws', async () => {
    mockGetProfile.mockRejectedValue(new Error('network error'))
    const { fetchProfile } = useUserProfile()
    await expect(fetchProfile()).rejects.toThrow('network error')
    expect(useUserProfileStore().loadingProfile).toBe(false)
  })

  it('fetchAcademicConfig sets hourlyLoad when config has one', async () => {
    const hourlyLoad = makeHourlyLoad()
    mockGetAcademicConfig.mockResolvedValue({ hourlyLoad })
    const { fetchAcademicConfig } = useUserProfile()
    await fetchAcademicConfig()
    expect(useUserProfileStore().hourlyLoad).toEqual(hourlyLoad)
  })

  it('fetchAcademicConfig does not set hourlyLoad when config has none', async () => {
    mockGetAcademicConfig.mockResolvedValue({})
    const { fetchAcademicConfig } = useUserProfile()
    await fetchAcademicConfig()
    expect(useUserProfileStore().hourlyLoad).toBeUndefined()
  })

  it('updateHourlyLoad sets isNewHourlyLoad when id differs', async () => {
    const store = useUserProfileStore()
    store.hourlyLoad = makeHourlyLoad(1)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(2))
    expect(store.isNewHourlyLoad).toBe(true)
  })

  it('updateHourlyLoad sets isUpdateHourlyLoad when id same but updatedAt differs', async () => {
    const store = useUserProfileStore()
    store.hourlyLoad = {
      id: 1,
      updatedAt: '2024-01-01',
      name: '',
      checkedAt: '',
      publishedAt: '',
      academicPeriodOrganizationUnit: {
        id: 0,
        fromDate: '',
        toDate: '',
        academicPeriod: {
          id: 0,
        },
        organizationUnit: {
          id: 0,
        },
      },
    } satisfies IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad({
      id: 1,
      updatedAt: '2024-06-01',
      name: '',
      checkedAt: '',
      publishedAt: '',
      academicPeriodOrganizationUnit: {
        id: 0,
        fromDate: '',
        toDate: '',
        academicPeriod: {
          id: 0,
        },
        organizationUnit: {
          id: 0,
        },
      },
    } satisfies IHourlyLoad)
    expect(store.isUpdateHourlyLoad).toBe(true)
  })

  it('updateHourlyLoad does not set flags when id same and updatedAt same', async () => {
    const store = useUserProfileStore()
    store.hourlyLoad = {
      id: 1,
      updatedAt: '2024-01-01',
      name: '',
      checkedAt: '',
      publishedAt: '',
      academicPeriodOrganizationUnit: {
        id: 0,
        fromDate: '',
        toDate: '',
        academicPeriod: {
          id: 0,
        },
        organizationUnit: {
          id: 0,
        },
      },
    } satisfies IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad({
      id: 1,
      updatedAt: '2024-01-01',
      name: '',
      checkedAt: '',
      publishedAt: '',
      academicPeriodOrganizationUnit: {
        id: 0,
        fromDate: '',
        toDate: '',
        academicPeriod: {
          id: 0,
        },
        organizationUnit: {
          id: 0,
        },
      },
    } satisfies IHourlyLoad)
    expect(store.isNewHourlyLoad).toBe(false)
    expect(store.isUpdateHourlyLoad).toBe(false)
  })

  it('updateHourlyLoad skips flag logic when currentHourlyLoad has no id', async () => {
    const store = useUserProfileStore()
    store.hourlyLoad = {
      updatedAt: '2024-01-01',
      id: 0,
      name: '',
      checkedAt: '',
      publishedAt: '',
      academicPeriodOrganizationUnit: {
        id: 0,
        fromDate: '',
        toDate: '',
        academicPeriod: {
          id: 0,
        },
        organizationUnit: {
          id: 0,
        },
      },
    } satisfies IHourlyLoad
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(1))
    expect(store.isNewHourlyLoad).toBe(false)
  })

  it('updateHourlyLoad works when hourlyLoad is undefined', async () => {
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateHourlyLoad } = useUserProfile()
    await updateHourlyLoad(makeHourlyLoad(1))
    expect(useUserProfileStore().hourlyLoad).toEqual(makeHourlyLoad(1))
  })

  it('fetchLatestHourlyLoad calls API and updates hourlyLoad', async () => {
    const load = makeHourlyLoad(5)
    mockGetLatestByFaculty.mockResolvedValue(load)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { fetchLatestHourlyLoad } = useUserProfile()
    await fetchLatestHourlyLoad(10)
    expect(mockGetLatestByFaculty).toHaveBeenCalledWith(10)
    expect(useUserProfileStore().hourlyLoad).toEqual(load)
  })

  it('updateFaculty patches service and updates profile facultyId', async () => {
    const store = useUserProfileStore()
    store.profile = {
      id: crypto.randomUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: null,
      setupCompleted: false,
    } as IUserProfile
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateFaculty } = useUserProfile()
    await updateFaculty(5)
    expect(mockProfilePatch).toHaveBeenCalledWith(expect.any(String), {
      facultyId: 5,
    })
    expect(store.profile?.facultyId).toBe(5)
  })

  it('updateFaculty patches service even when profile is undefined', async () => {
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateFaculty } = useUserProfile()
    await updateFaculty(5)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateSpeciality patches service and updates profile specialityId', async () => {
    const store = useUserProfileStore()
    store.profile = {
      id: crypto.randomUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: null,
      setupCompleted: false,
    } as IUserProfile
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSpeciality } = useUserProfile()
    await updateSpeciality(7)
    expect(store.profile?.specialityId).toBe(7)
  })

  it('updateSpeciality patches even when profile is undefined', async () => {
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSpeciality } = useUserProfile()
    await updateSpeciality(7)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateSetupCompleted patches service and updates profile', async () => {
    const store = useUserProfileStore()
    store.profile = {
      id: crypto.randomUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: null,
      setupCompleted: false,
    } as IUserProfile
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSetupCompleted } = useUserProfile()
    await updateSetupCompleted(true)
    expect(store.profile?.setupCompleted).toBe(true)
  })

  it('updateSetupCompleted patches even when profile is undefined', async () => {
    mockProfilePatch.mockResolvedValue(undefined)
    const { updateSetupCompleted } = useUserProfile()
    await updateSetupCompleted(true)
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('updateBasicSettings patches profile and hourlyLoad, then updates profile', async () => {
    const load = makeHourlyLoad(1)
    const store = useUserProfileStore()
    store.profile = {
      id: crypto.randomUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: null,
      setupCompleted: false,
    } as IUserProfile
    mockProfilePatch.mockResolvedValue(undefined)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateBasicSettings } = useUserProfile()
    await updateBasicSettings({
      facultyId: 3,
      specialityId: 4,
      studyPlanId: null,
      hourlyLoad: load,
    })
    expect(store.profile?.facultyId).toBe(3)
    expect(store.profile?.specialityId).toBe(4)
  })

  it('updateBasicSettings works when profile is undefined', async () => {
    const load = makeHourlyLoad(1)
    mockProfilePatch.mockResolvedValue(undefined)
    mockAcademicPatch.mockResolvedValue(undefined)
    const { updateBasicSettings } = useUserProfile()
    await updateBasicSettings({
      facultyId: 3,
      specialityId: 4,
      studyPlanId: null,
      hourlyLoad: load,
    })
    expect(mockProfilePatch).toHaveBeenCalled()
  })

  it('completeSetup creates profile, academic config, preferences, and sets store values', async () => {
    const load = makeHourlyLoad(1)
    mockCreateProfile.mockResolvedValue({
      id: crypto.randomUUID(),
      facultyId: 2,
      specialityId: 3,
      studyPlanId: null,
      setupCompleted: true,
    })
    mockCreateAcademicConfig.mockResolvedValue({
      id: crypto.randomUUID(),
      hourlyLoad: load,
    })
    mockCreatePreferences.mockResolvedValue({
      id: crypto.randomUUID(),
      weekDays: [1, 2, 3],
      crossings: 0,
      maxGenerationHistory: 10,
    })
    const { completeSetup } = useUserProfile()
    await completeSetup({
      facultyId: 2,
      specialityId: 3,
      studyPlanId: null,
      hourlyLoad: load,
    })
    const store = useUserProfileStore()
    expect(mockCreateProfile).toHaveBeenCalled()
    expect(mockCreateAcademicConfig).toHaveBeenCalled()
    expect(mockCreatePreferences).toHaveBeenCalled()
    expect(store.profile?.facultyId).toBe(2)
    expect(store.hourlyLoad).toEqual(load)
  })
})
