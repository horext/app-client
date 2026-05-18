import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IOrganization } from '~/interfaces/organization'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { Weekdays } from '~/interfaces/event'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserConfigStore = defineStore('user-config', () => {
  const profileService = useProfileService()
  const academicConfigService = useAcademicConfigService()
  const preferencesService = usePreferencesService()

  const faculty = ref<IOrganization>()
  const speciality = ref<IOrganization>()
  const hourlyLoad = ref<IHourlyLoad>()
  const subjects = ref<Array<ISelectedSubject>>([])
  const favoritesSchedules = ref<IScheduleGenerate[]>([])
  const weekDays = ref<Weekdays[]>([0, 1, 2, 3, 4, 5, 6])
  const crossings = ref(0)
  const maxGenerationHistory = ref(5)
  const setupCompleted = ref(false)
  const isNewHourlyLoad = ref(false)
  const isUpdateHourlyLoad = ref(false)

  const facultyId = computed(() => {
    return faculty.value?.id
  })

  const specialityId = computed(() => {
    return speciality.value?.id
  })

  const hourlyLoadId = computed(() => {
    return hourlyLoad?.value?.id
  })

  async function updateFaculty(_faculty: IOrganization) {
    faculty.value = _faculty
    await profileService.updateFaculty(_faculty)
  }

  async function updateSpeciality(_speciality: IOrganization) {
    speciality.value = _speciality
    await profileService.updateSpeciality(_speciality)
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    setupCompleted.value = _setupCompleted
    await profileService.updateSetupCompleted(_setupCompleted)
  }

  async function updateCrossings(_crossings: number) {
    crossings.value = _crossings
    await preferencesService.updateCrossings(_crossings)
  }

  async function fetchFaculty() {
    const profile = await profileService.getProfile()
    if (profile?.faculty) {
      faculty.value = profile.faculty
      return profile.faculty
    }
  }

  async function fetchSpeciality() {
    const profile = await profileService.getProfile()
    if (profile?.speciality) {
      speciality.value = profile.speciality
      return profile.speciality
    }
  }

  async function fetchCrossings() {
    const prefs = await preferencesService.getPreferences()
    crossings.value = prefs?.crossings ?? 0
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
    await academicConfigService.updateHourlyLoad(newHourlyLoad)
  }

  async function fetchHourlyLoad() {
    const config = await academicConfigService.getAcademicConfig()
    if (config?.hourlyLoad) {
      hourlyLoad.value = config.hourlyLoad
      return config.hourlyLoad
    }
  }

  async function fetchProfile() {
    const profile = await profileService.getProfile()
    if (profile) {
      if (profile.faculty) faculty.value = profile.faculty
      if (profile.speciality) speciality.value = profile.speciality
      setupCompleted.value = profile.setupCompleted ?? false
    }
  }

  async function initProfile() {
    const profile = await profileService.createProfile()
    if (profile.faculty) faculty.value = profile.faculty
    if (profile.speciality) speciality.value = profile.speciality
    setupCompleted.value = profile.setupCompleted ?? false
  }

  async function initAcademicConfig() {
    const config = await academicConfigService.createAcademicConfig()
    if (config.hourlyLoad) hourlyLoad.value = config.hourlyLoad
  }

  async function initPreferences() {
    const prefs = await preferencesService.createPreferences()
    weekDays.value = prefs.weekDays ?? [0, 1, 2, 3, 4, 5, 6]
    crossings.value = prefs.crossings ?? 0
    maxGenerationHistory.value = prefs.maxGenerationHistory ?? 5
  }

  async function completeSetup(
    _faculty: IOrganization,
    _speciality: IOrganization,
    _hourlyLoad: IHourlyLoad,
  ) {
    await Promise.all([
      profileService.completeSetup(_faculty, _speciality),
      academicConfigService.updateHourlyLoad(_hourlyLoad),
    ])
    faculty.value = _faculty
    speciality.value = _speciality
    hourlyLoad.value = _hourlyLoad
    setupCompleted.value = true
  }

  const fetchWeekDays = async () => {
    const prefs = await preferencesService.getPreferences()
    weekDays.value = prefs?.weekDays ?? [0, 1, 2, 3, 4, 5, 6]
  }

  const saveWeekDays = async (data: Weekdays[]) => {
    weekDays.value = data
    await preferencesService.updateWeekDays(data)
  }

  const updateMaxGenerationHistory = async (n: number) => {
    maxGenerationHistory.value = n
    await preferencesService.updateMaxGenerationHistory(n)
  }

  return {
    crossings,
    maxGenerationHistory,
    faculty,
    speciality,
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
    fetchFaculty,
    fetchSpeciality,
    fetchHourlyLoad,
    fetchProfile,
    initProfile,
    initAcademicConfig,
    initPreferences,
    completeSetup,
    fetchCrossings,
    fetchWeekDays,
    saveWeekDays,
    updateMaxGenerationHistory,
  }
})
