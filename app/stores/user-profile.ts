import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserProfile } from '~/interfaces/profile'
import type { IHourlyLoad } from '~/interfaces/houly-load'

export const useUserProfileStore = defineStore('user-profile', () => {
  const loadingProfile = ref(true)
  const profile = ref<IUserProfile>()
  const hourlyLoad = ref<IHourlyLoad>()
  const isNewHourlyLoad = ref(false)
  const isUpdateHourlyLoad = ref(false)

  const setupCompleted = computed(() => loadingProfile.value === false && !!profile.value)
  const facultyId = computed(() => profile.value?.facultyId)
  const specialityId = computed(() => profile.value?.specialityId)

  return {
    profile,
    hourlyLoad,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    setupCompleted,
    facultyId,
    specialityId,
    loadingProfile,
  }
})
