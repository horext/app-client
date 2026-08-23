import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import {
  useHourlyLoadApi,
  useSpecialityApi,
} from '~~/modules/apis/runtime/composables'
import { toAcademicConfigDto, toProfileDto } from '~/mappers/domain/entities'

const cloneHourlyLoad = (hourlyLoad: IHourlyLoad): IHourlyLoad =>
  structuredClone(toRaw(hourlyLoad))

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
      profile.value = data ? toProfileDto(data) : undefined
      if (profile.value?.specialityId) {
        await fetchSpecialityById(profile.value.specialityId)
      } else {
        speciality.value = undefined
      }
    } finally {
      loadingProfile.value = false
    }
  }

  async function fetchAcademicConfig() {
    const config = await academicConfigService.get(userId)
    const dto = config ? toAcademicConfigDto(config) : undefined
    hourlyLoad.value = dto?.hourlyLoad ?? undefined
  }

  async function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
    const plainHourlyLoad = cloneHourlyLoad(newHourlyLoad)
    const currentHourlyLoad = hourlyLoad.value
    if (currentHourlyLoad?.id) {
      if (currentHourlyLoad.id !== plainHourlyLoad.id) {
        isNewHourlyLoad.value = true
      } else if (
        currentHourlyLoad.id === plainHourlyLoad.id &&
        currentHourlyLoad.updatedAt !== plainHourlyLoad.updatedAt
      ) {
        isUpdateHourlyLoad.value = true
      }
    }
    hourlyLoad.value = plainHourlyLoad
    await academicConfigService.patch(userId, {
      hourlyLoad: plainHourlyLoad,
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

  async function updateSpeciality(_specialityId?: number) {
    await profileService.patch(userId, { specialityId: _specialityId })
    if (profile.value)
      profile.value = { ...profile.value, specialityId: _specialityId }
    if (_specialityId) {
      await fetchSpecialityById(_specialityId)
    } else {
      speciality.value = undefined
    }
  }

  async function updateSetupCompleted(_setupCompleted: boolean) {
    await profileService.patch(userId, { setupCompleted: _setupCompleted })
    if (profile.value)
      profile.value = { ...profile.value, setupCompleted: _setupCompleted }
  }

  async function updateBasicSettings(
    _facultyId: number,
    _specialityId?: number,
    _hourlyLoad?: IHourlyLoad | null,
    _studyPlanId?: number,
  ) {
    if (_specialityId) {
      await fetchSpecialityById(_specialityId)
    } else {
      speciality.value = undefined
    }
    await Promise.all([
      profileService.patch(userId, {
        facultyId: _facultyId,
        specialityId: _specialityId,
        studyPlanId: _studyPlanId,
      }),
      _hourlyLoad
        ? updateHourlyLoad(_hourlyLoad)
        : academicConfigService.patch(userId, { hourlyLoad: null }).then(() => {
            hourlyLoad.value = undefined
          }),
    ])
    if (profile.value)
      profile.value = {
        ...profile.value,
        facultyId: _facultyId,
        specialityId: _specialityId,
        studyPlanId: _studyPlanId,
      }
  }

  const { createPreferences } = useUserPreferences()
  async function completeSetup(
    _facultyId: number,
    _specialityId?: number,
    _hourlyLoad?: IHourlyLoad | null,
    _studyPlanId?: number,
  ) {
    if (_specialityId) {
      await fetchSpecialityById(_specialityId)
    } else {
      speciality.value = undefined
    }
    const plainHourlyLoad = _hourlyLoad ? cloneHourlyLoad(_hourlyLoad) : null
    const [createdProfile] = await Promise.all([
      profileService.create(userId, {
        facultyId: _facultyId,
        specialityId: _specialityId,
        studyPlanId: _studyPlanId,
        setupCompleted: true,
      }),
      academicConfigService.create(userId, {
        hourlyLoad: plainHourlyLoad,
      }),
      createPreferences(),
    ])
    profile.value = toProfileDto(createdProfile)
    hourlyLoad.value = plainHourlyLoad ?? undefined
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
