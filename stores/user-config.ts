import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IOrganization } from '~/interfaces/organization'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'

export const useUserConfigStore = defineStore('user-config', () => {
  const storage = useLocalStorage()
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
  const weekDays = ref([0, 1, 2, 3, 4, 5, 6])
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

  async function saveNewSubject(_subject: ISelectedSubject) {
    subjects.value.push(Object.assign({}, _subject))
    await storage.setItem('mySubjects', subjects.value)
  }

  async function deleteSubjectById(id: number) {
    const index = subjects.value.findIndex((s) => s.id === id)
    subjects.value.splice(index, 1)
    await storage.setItem('mySubjects', subjects.value)
  }

  async function updateSubject(_subject: ISelectedSubject) {
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value = subjects.value.map((c, i) => (i === index ? _subject : c))
    await storage.setItem('mySubjects', subjects.value)
  }

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    schedules.value = _schedules
    await storage.setItem('mySchedules', schedules.value)
  }

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate,
  ) {
    favoritesSchedules.value.push(Object.assign({}, _favoritesSchedule))
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  async function deleteFavoriteScheduleById(id: IScheduleGenerate['id']) {
    const index = favoritesSchedules.value.findIndex((s) => s.id === id)
    favoritesSchedules.value.splice(index, 1)
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  async function updateFavoritesSchedules(
    _favoritesSchedules: IScheduleGenerate[],
  ) {
    favoritesSchedules.value = _favoritesSchedules
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  const addFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    await updateFavoritesSchedules([...favoritesSchedules.value, schedule])
  }

  const removeFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    const newFavorites = favoritesSchedules.value.filter(
      (s) => s.id !== schedule.id,
    )
    await updateFavoritesSchedules(newFavorites)
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

  async function fetchSubjects() {
    const data = (await storage.getItem<ISelectedSubject[]>('mySubjects')) || []
    const _subjets = data?.filter((subject) => subject?.schedules?.length > 0)
    subjects.value = _subjets
  }

  async function fetchCrossings() {
    const data: number | undefined =
      (await storage.getItem<number>('myCrossings')) || 0
    const _crossings = Number(data) || 0
    crossings.value = _crossings
  }

  async function fetchSchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>('mySchedules')) || []
    const _schedules: IScheduleGenerate[] = data || []
    schedules.value = _schedules
  }

  async function fetchFavoritesSchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>('myFavoritesSchedules')) || []
    const _schedules: IScheduleGenerate[] = data || []
    favoritesSchedules.value = _schedules
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
      await storage.getItem<IIntersectionOccurrence[]>('myOcurrences')
    occurrences.value = data || []
  }

  const updateOccurrences = async (data: IIntersectionOccurrence[]) => {
    occurrences.value = data
    await storage.setItem<IIntersectionOccurrence[]>('myOcurrences', data)
  }

  const fetchWeekDays = async () => {
    const data = await storage.getItem<number[]>('myWeekDays')
    weekDays.value = data || [0, 1, 2, 3, 4, 5, 6]
  }

  const saveWeekDays = async (data: number[]) => {
    weekDays.value = data
    await storage.setItem<number[]>('myWeekDays', data)
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
    saveNewSubject,
    deleteSubjectById,
    updateSubject,
    updateSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    updateFavoritesSchedules,
    fetchFaculty,
    fetchSpeciality,
    fetchFirstEntry,
    fetchSubjects,
    fetchCrossings,
    fetchSchedules,
    fetchFavoritesSchedules,
    fetchMyOcurrences,
    updateOccurrences,
    occurrences,
    addFavoriteSchedule,
    removeFavoriteSchedule,
    fetchWeekDays,
    saveWeekDays,
  }
})
