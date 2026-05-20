import { storeToRefs } from 'pinia'
import type { IHourlyLoad } from '~/interfaces/houly-load'

export const useUserProfile = () => {
  const store = useUserProfileStore()
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()
  const {
    profile,
    hourlyLoad,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    setupCompleted,
    facultyId,
    specialityId,
  } = storeToRefs(store)

  async function fetchProfile() {
    if (!profileService) return
    profile.value = await profileService.getProfile()
  }

  async function fetchAcademicConfig() {
    if (!academicConfigService) return
    const config = await academicConfigService.getAcademicConfig()
    if (config?.hourlyLoad) hourlyLoad.value = config.hourlyLoad
  }

  async function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
    if (!academicConfigService) return
    const config = await academicConfigService.getAcademicConfig()
    const currentHourlyLoad = config?.hourlyLoad ?? null
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

  async function updateFaculty(_facultyId: number) {
    if (!profileService) return
    await profileService.patch({ facultyId: _facultyId })
    if (profile.value) profile.value = { ...profile.value, facultyId: _facultyId }
  }

  async function updateSpeciality(_specialityId: number) {
    if (!profileService) return
    await profileService.patch({ specialityId: _specialityId })
    if (profile.value)
      profile.value = { ...profile.value, specialityId: _specialityId }
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    if (!profileService) return
    await profileService.patch({ setupCompleted: _setupCompleted })
    if (profile.value)
      profile.value = { ...profile.value, setupCompleted: _setupCompleted }
  }

  async function updateBasicSettings(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
    if (!profileService) return
    await Promise.all([
      profileService.patch({ facultyId: _facultyId, specialityId: _specialityId }),
      updateHourlyLoad(_hourlyLoad),
    ])
    if (profile.value)
      profile.value = {
        ...profile.value,
        facultyId: _facultyId,
        specialityId: _specialityId,
      }
  }

  async function completeSetup(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
    if (!profileService || !academicConfigService) return
    const { createPreferences } = useUserPreferences()
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
  }
}
