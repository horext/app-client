import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IOrganization } from '~/interfaces/organization'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { Weekdays } from '~/interfaces/event'

export const useUserConfigStore = defineStore('user-config', () => {
  const storage = useLocalStorage<{
    items: {
      mySubjects: Array<ISelectedSubject>
      myCrossings: number
      mySchedules: Array<IScheduleGenerate>
      myFavoritesSchedules: Array<IScheduleGenerate>
      myOcurrences: Array<IIntersectionOccurrence>
      myWeekDays: Weekdays[]
    }
  }>()
  const myFaculty = useCookie<IOrganization | null>('myFaculty', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
  })
  const mySpeciality = useCookie<IOrganization | null>('mySpeciality', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
  })
  const myFirstEntry = useCookie<boolean>('myFirstEntry', {
    default: () => true,
    maxAge: 60 * 60 * 24 * 365,
  })
  const myHourlyLoad = useCookie<IHourlyLoad | null>('myHourlyLoad', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
  })

  const faculty = ref<IOrganization>()
  const speciality = ref<IOrganization>()
  const hourlyLoad = ref<IHourlyLoad>()
  const subjects = ref<Array<ISelectedSubject>>([])
  const schedules = ref<Array<IScheduleGenerate>>([])
  const favoritesSchedules = ref<Array<IScheduleGenerate>>([])
  const occurrences = ref<IIntersectionOccurrence[]>([])
  const weekDays = ref<Weekdays[]>([0, 1, 2, 3, 4, 5, 6])
  const crossings = ref(0)
  const firstEntry = ref(true)
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

  function updateFaculty(_faculty: IOrganization) {
    myFaculty.value = _faculty
    faculty.value = _faculty
  }

  async function updateSpeciality(_speciality: IOrganization) {
    mySpeciality.value = _speciality
    speciality.value = _speciality
  }

  function updateFirstEntry(_myFirstEntry: boolean) {
    myFirstEntry.value = _myFirstEntry
    firstEntry.value = _myFirstEntry
  }

  async function updateCrossings(_crossings: number) {
    await storage.setItem('myCrossings', _crossings)
    crossings.value = _crossings
  }

  function fetchFaculty() {
    const data = myFaculty.value
    if (data) {
      faculty.value = data
      return data
    }
  }

  function fetchSpeciality() {
    const data = mySpeciality.value
    if (data) {
      speciality.value = data
      return data
    }
  }

  function fetchFirstEntry() {
    const data = myFirstEntry.value
    firstEntry.value = data
  }

  async function fetchCrossings() {
    const data: number | undefined =
      (await storage.getItem('myCrossings')) || 0
    const _crossings = Number(data) || 0
    crossings.value = _crossings
  }

  function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
    hourlyLoad.value = newHourlyLoad
    const currentHourlyLoad: IHourlyLoad | null | undefined = myHourlyLoad.value
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
    myHourlyLoad.value = newHourlyLoad
  }

  const fetchMyOcurrences = async () => {
    const data =
      await storage.getItem('myOcurrences')
    occurrences.value = data || []
  }

  const updateOccurrences = async (data: IIntersectionOccurrence[]) => {
    occurrences.value = data
    await storage.setItem('myOcurrences', data)
  }

  const fetchWeekDays = async () => {
    const data = await storage.getItem('myWeekDays')
    weekDays.value = data || [0, 1, 2, 3, 4, 5, 6]
  }

  const saveWeekDays = async (data: Weekdays[]) => {
    weekDays.value = data
    await storage.setItem('myWeekDays', data)
  }

  return {
    crossings,
    faculty,
    speciality,
    hourlyLoad,
    subjects,
    schedules,
    favoritesSchedules,
    weekDays,
    firstEntry,
    facultyId,
    specialityId,
    hourlyLoadId,
    isNewHourlyLoad,
    isUpdateHourlyLoad,
    updateFaculty,
    updateSpeciality,
    updateFirstEntry,
    updateCrossings,
    updateHourlyLoad,
    fetchFaculty,
    fetchSpeciality,
    fetchFirstEntry,
    fetchCrossings,
    fetchMyOcurrences,
    updateOccurrences,
    occurrences,
    fetchWeekDays,
    saveWeekDays,
  }
})
