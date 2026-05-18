import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserProfile } from '~/interfaces/profile'
import type { IHourlyLoad } from '~/interfaces/houly-load'

export const useUserProfileStore = defineStore('user-profile', () => {
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()

  const profile = ref<IUserProfile>()
  const hourlyLoad = ref<IHourlyLoad>()
  const isNewHourlyLoad = ref(false)
  const isUpdateHourlyLoad = ref(false)

  const setupCompleted = computed(() => profile.value?.setupCompleted ?? false)
  const facultyId = computed(() => profile.value?.facultyId)
  const specialityId = computed(() => profile.value?.specialityId)

  async function updateFaculty(_facultyId: number) {
    await profileService.patch({ facultyId: _facultyId })
    if (profile.value) profile.value = { ...profile.value, facultyId: _facultyId }
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

  async function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
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

  async function fetchProfile() {
    profile.value = await profileService.getProfile()
  }

  async function fetchAcademicConfig() {
    const config = await academicConfigService.getAcademicConfig()
    if (config?.hourlyLoad) hourlyLoad.value = config.hourlyLoad
  }

  async function updateBasicSettings(
    _facultyId: number,
    _specialityId: number,
    _hourlyLoad: IHourlyLoad,
  ) {
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
    const preferencesStore = useUserPreferencesStore()
    await Promise.all([
      profileService.createProfile({
        facultyId: _facultyId,
        specialityId: _specialityId,
        setupCompleted: true,
      }),
      academicConfigService.createAcademicConfig({ hourlyLoad: _hourlyLoad }),
      preferencesStore.createPreferences(),
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
    updateFaculty,
    updateSpeciality,
    updateSetupCompleted,
    updateHourlyLoad,
    fetchProfile,
    fetchAcademicConfig,
    updateBasicSettings,
    completeSetup,
  }
})
