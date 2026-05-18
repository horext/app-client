import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserProfile } from '~/interfaces/profile'
import type { IOrganization } from '~/interfaces/organization'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IUserPreferences } from '~/interfaces/preferences'
import type { Weekdays } from '~/interfaces/event'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserConfigStore = defineStore('user-config', () => {
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()
  const preferencesService = usePreferencesService()

  const profile = ref<IUserProfile>()
  const hourlyLoad = ref<IHourlyLoad>()
  const subjects = ref<Array<ISelectedSubject>>([])
  const favoritesSchedules = ref<IScheduleGenerate[]>([])
  const preferences = ref<IUserPreferences>()
  const isNewHourlyLoad = ref(false)
  const isUpdateHourlyLoad = ref(false)

  const weekDays = computed(
    () =>
      preferences.value?.weekDays ??
      ([0, 1, 2, 3, 4, 5, 6] satisfies Weekdays[]),
  )
  const crossings = computed(() => preferences.value?.crossings ?? 0)
  const maxGenerationHistory = computed(
    () => preferences.value?.maxGenerationHistory ?? 5,
  )
  const setupCompleted = computed(() => profile.value?.setupCompleted ?? false)
  const facultyId = computed(() => profile.value?.faculty.id)
  const specialityId = computed(() => profile.value?.speciality.id)
  const hourlyLoadId = computed(() => hourlyLoad.value?.id)

  async function updateFaculty(_faculty: IOrganization) {
    await profileService.patch({ faculty: _faculty })
    if (profile.value) profile.value = { ...profile.value, faculty: _faculty }
  }

  async function updateSpeciality(_speciality: IOrganization) {
    await profileService.patch({ speciality: _speciality })
    if (profile.value)
      profile.value = { ...profile.value, speciality: _speciality }
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    await profileService.patch({ setupCompleted: _setupCompleted })
    if (profile.value)
      profile.value = { ...profile.value, setupCompleted: _setupCompleted }
  }

  async function updateCrossings(_crossings: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, crossings: _crossings }
    await preferencesService.patch({ crossings: _crossings })
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

  async function fetchPreferences() {
    const prefs = await preferencesService.getPreferences()
    if (prefs) preferences.value = prefs
  }

  async function updateBasicSettings(
    _faculty: IOrganization,
    _speciality: IOrganization,
    _hourlyLoad: IHourlyLoad,
  ) {
    await Promise.all([
      profileService.patch({ faculty: _faculty, speciality: _speciality }),
      updateHourlyLoad(_hourlyLoad),
    ])
    if (profile.value)
      profile.value = {
        ...profile.value,
        faculty: _faculty,
        speciality: _speciality,
      }
  }

  async function completeSetup(
    _faculty: IOrganization,
    _speciality: IOrganization,
    _hourlyLoad: IHourlyLoad,
  ) {
    await Promise.all([
      profileService.createProfile({
        faculty: _faculty,
        speciality: _speciality,
        setupCompleted: true,
      }),
      academicConfigService.createAcademicConfig({ hourlyLoad: _hourlyLoad }),
      preferencesService.createPreferences(),
    ])
    profile.value = {
      id: 'profile',
      faculty: _faculty,
      speciality: _speciality,
      setupCompleted: true,
    }
    hourlyLoad.value = _hourlyLoad
  }

  const saveWeekDays = async (data: Weekdays[]) => {
    if (preferences.value)
      preferences.value = { ...preferences.value, weekDays: data }
    await preferencesService.patch({ weekDays: data })
  }

  const updateMaxGenerationHistory = async (n: number) => {
    if (preferences.value)
      preferences.value = { ...preferences.value, maxGenerationHistory: n }
    await preferencesService.patch({ maxGenerationHistory: n })
  }

  return {
    profile,
    preferences,
    crossings,
    maxGenerationHistory,
    hourlyLoad,
    subjects,
    favoritesSchedules,
    weekDays,
    setupCompleted,
    facultyId,
    specialityId,
    hourlyLoadId,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    updateFaculty,
    updateSpeciality,
    updateSetupCompleted,
    updateCrossings,
    updateHourlyLoad,
    fetchProfile,
    fetchAcademicConfig,
    fetchPreferences,
    updateBasicSettings,
    completeSetup,
    saveWeekDays,
    updateMaxGenerationHistory,
  }
})
