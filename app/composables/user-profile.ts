import { storeToRefs } from 'pinia'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IApiRegistry } from '~~/modules/apis/runtime'
import { useHourlyLoadApi } from '~~/modules/apis/runtime/composables'

export const useUserProfile = (apis?: IApiRegistry) => {
  const store = useUserProfileStore()
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()
  const hourlyLoadApi = useHourlyLoadApi(apis)
  const {
    profile,
    hourlyLoad,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    setupCompleted,
    facultyId,
    specialityId,
    loadingProfile,
  } = storeToRefs(store)

  async function fetchProfile() {
    try {
      loadingProfile.value = true
      profile.value = await profileService.getProfile()
    } finally {
      loadingProfile.value = false
    }
  }

  async function fetchAcademicConfig() {
    const config = await academicConfigService.getAcademicConfig()
    if (config?.hourlyLoad) hourlyLoad.value = config.hourlyLoad
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
    await academicConfigService.patch({ hourlyLoad: newHourlyLoad })
  }

  async function fetchLatestHourlyLoad(facultyId: number) {
    const data = await hourlyLoadApi.getLatestByFaculty(facultyId)
    updateHourlyLoad(data)
  }

  async function updateFaculty(_facultyId: number) {
    await profileService.patch({ facultyId: _facultyId })
    if (profile.value)
      profile.value = { ...profile.value, facultyId: _facultyId }
  }

  async function updateSpeciality(_specialityId: number) {
    await profileService.patch({ specialityId: _specialityId })
    if (profile.value)
      profile.value = { ...profile.value, specialityId: _specialityId }
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    await profileService.patch({ setupCompleted: _setupCompleted })
    if (profile.value)
      profile.value = { ...profile.value, setupCompleted: _setupCompleted }
  }

  async function updateBasicSettings(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
    await Promise.all([
      profileService.patch({
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
    await Promise.all([
      profileService.createProfile({
        facultyId: _facultyId,
        specialityId: _specialityId,
        setupCompleted: true,
      }),
      academicConfigService.createAcademicConfig({ hourlyLoad: _hourlyLoad }),
      createPreferences(),
    ])
    profile.value = {
      id: 'profile',
      facultyId: _facultyId,
      specialityId: _specialityId,
      setupCompleted: true,
    }
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
  }
}
