import { storeToRefs } from 'pinia'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import {
  useHourlyLoadApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'

export const useUserProfile = () => {
  const store = useUserProfileStore()
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()
  const userId = useSchedulesUserId()
  const hourlyLoadApi = useHourlyLoadApi()
  const specialityApi = useSpecialityApi()
  const {
    profile,
    hourlyLoad,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    setupCompleted,
    facultyId,
    specialityId,
    loadingProfile,
    speciality,
  } = storeToRefs(store)

  async function fetchProfile() {
    try {
      loadingProfile.value = true
      const data = await profileService.get(userId)
      profile.value = data
    } finally {
      loadingProfile.value = false
    }
  }

  async function fetchAcademicConfig() {
    const config = await academicConfigService.get(userId)
    if (config?.hourlyLoad) {
      hourlyLoad.value = config.hourlyLoad ?? undefined
    }
  }

  async function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
    const currentHourlyLoad = hourlyLoad.value
    if (currentHourlyLoad?.id) {
      if (currentHourlyLoad.id !== newHourlyLoad.id) {
        isNewHourlyLoad.value = true
      } else if (
        currentHourlyLoad.id === newHourlyLoad.id &&
        currentHourlyLoad.updatedAt !== newHourlyLoad.updatedAt
      ) {
        isUpdateHourlyLoad.value = true
      }
    }
    hourlyLoad.value = newHourlyLoad
    await academicConfigService.patch(userId, {
      hourlyLoad: {
        ...newHourlyLoad,
        academicPeriodOrganizationUnit: {
          ...newHourlyLoad.academicPeriodOrganizationUnit,
          academicPeriod: {
            ...newHourlyLoad.academicPeriodOrganizationUnit.academicPeriod,
          },
          organizationUnit: {
            ...newHourlyLoad.academicPeriodOrganizationUnit.organizationUnit,
          },
        },
      },
    })
  }

  async function fetchLatestHourlyLoad(facultyId: number) {
    const data = await hourlyLoadApi.getLatestByFaculty(facultyId)
    updateHourlyLoad(data)
  }

  async function fetchSpecialityById(specialityId: number) {
    const data = await specialityApi.getById(specialityId)
    speciality.value = data
  }

  async function updateFaculty(_facultyId: number) {
    await profileService.patch(userId, { facultyId: _facultyId })
    if (profile.value)
      profile.value = { ...profile.value, facultyId: _facultyId }
  }

  async function updateSpeciality(_specialityId: number) {
    await profileService.patch(userId, { specialityId: _specialityId })
    if (profile.value)
      profile.value = { ...profile.value, specialityId: _specialityId }
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    await profileService.patch(userId, { setupCompleted: _setupCompleted })
    if (profile.value)
      profile.value = { ...profile.value, setupCompleted: _setupCompleted }
  }

  async function updateBasicSettings(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
    await Promise.all([
      profileService.patch(userId, {
        facultyId: _facultyId,
        specialityId: _specialityId,
      }),
      updateHourlyLoad(_hourlyLoad),
    ])
    if (profile.value)
      profile.value = {
        ...profile.value,
        facultyId: _facultyId,
        specialityId: _specialityId,
      }
  }

  const { createPreferences } = useUserPreferences()
  async function completeSetup(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
    const [createdProfile] = await Promise.all([
      profileService.create(userId, {
        facultyId: _facultyId,
        specialityId: _specialityId,
        setupCompleted: true,
      }),
      academicConfigService.create(userId, {
        hourlyLoad: _hourlyLoad,
      }),
      createPreferences(),
    ])
    profile.value = createdProfile
    hourlyLoad.value = _hourlyLoad
  }

  return {
    loadingProfile,
    profile,
    hourlyLoad,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    setupCompleted,
    facultyId,
    specialityId,
    fetchProfile,
    fetchAcademicConfig,
    updateHourlyLoad,
    updateFaculty,
    updateSpeciality,
    updateSetupCompleted,
    updateBasicSettings,
    completeSetup,
    fetchLatestHourlyLoad,
    fetchSpecialityById,
  }
}
