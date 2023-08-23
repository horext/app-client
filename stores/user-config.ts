import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { IOrganization } from '~/interfaces/organization'
import { ISelectedSubject } from '~/interfaces/subject'
import { $storage, $api } from '~/utils/api'
import Event from '~/model/Event'
import { ISchedule } from '~/interfaces/schedule'
import { IHourlyLoad } from '~/interfaces/houly-load'

export const useUserConfigStore = defineStore('user-config', () => {
  const faculty = ref<IOrganization>()
  const speciality = ref<IOrganization>()
  const hourlyLoad = ref<IHourlyLoad>()
  const subjects = ref<Array<ISelectedSubject>>([])
  const schedules = ref<Array<ISchedule>>([])
  const favoritesSchedules = ref<Array<ISchedule>>([])
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

  function ADD_SUBJECT(subject: ISelectedSubject) {
    subjects.value.push(Object.assign({}, subject))
  }

  function DELETE_SUBJECT_BY_INDEX(index: number) {
    subjects.value.splice(index, 1)
  }

  function UPDATE_SUBJECT_BY_INDEX(index: number, subject: ISelectedSubject) {
    subjects.value = subjects.value.map((c, i) => (i === index ? subject : c))
  }

  function ADD_SCHEDULE(subject: ISchedule) {
    schedules.value.push(Object.assign({}, subject))
  }

  function DELETE_SCHEDULE_BY_INDEX(index: number) {
    schedules.value.splice(index, 1)
  }

  function UPDATE_SCHEDULE_BY_INDEX(index: number, schedule: ISchedule) {
    schedules.value = schedules.value.map((c, i) =>
      i === index ? schedule : c
    )
  }

  function ADD_FAVORITE_SCHEDULE(subject: ISchedule) {
    favoritesSchedules.value.push(Object.assign({}, subject))
  }

  function DELETE_FAVORITE_SCHEDULE_BY_INDEX(index: number) {
    favoritesSchedules.value.splice(index, 1)
  }

  function UPDATE_FAVORITE_SCHEDULE_BY_INDEX(
    index: number,
    subject: ISchedule
  ) {
    favoritesSchedules.value = favoritesSchedules.value.map((c, i) =>
      i === index ? subject : c
    )
  }

  async function updateFaculty(_faculty: IOrganization) {
    await $storage.setUniversal('myFaculty', _faculty)
    faculty.value = _faculty
  }

  async function updateSpeciality(_speciality: IOrganization) {
    $storage.setUniversal('mySpeciality', _speciality)
    speciality.value = _speciality
    await fetchHourlyLoad()
  }

  async function updateFirstEntry(_myFirstEntry: boolean) {
    await $storage.setUniversal('myFirstEntry', _myFirstEntry)
    firstEntry.value = _myFirstEntry
  }

  function updateCrossings(_crossings: number) {
    $storage.setUniversal('myCrossings', _crossings)
    crossings.value = _crossings
  }

  function saveNewSubject(_subject: ISelectedSubject) {
    ADD_SUBJECT(_subject)
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function deleteSubjectById(id: number) {
    const index = subjects.value.findIndex((s) => s.id === id)
    DELETE_SUBJECT_BY_INDEX(index)
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function updateSubject(_subject: ISelectedSubject) {
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    UPDATE_SUBJECT_BY_INDEX(index, _subject)
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function updateSchedules(_schedules: ISchedule[]) {
    schedules.value = _schedules
    $storage.setLocalStorage('mySchedules', schedules.value)
  }

  function saveNewFavoriteSchedule(_favoritesSchedule: ISchedule) {
    ADD_FAVORITE_SCHEDULE(_favoritesSchedule)
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  function deleteFavoriteScheduleById(id: number) {
    const index = subjects.value.findIndex((s) => s.id === id)
    DELETE_FAVORITE_SCHEDULE_BY_INDEX(index)
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  function updateFavoritesSchedules(_favoritesSchedules: ISchedule[]) {
    favoritesSchedules.value = _favoritesSchedules
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  async function fetchFaculty() {
    const data = await $storage.getUniversal('myFaculty')
    faculty.value = data
  }

  function fetchSpeciality() {
    const data = $storage.getUniversal('mySpeciality')
    speciality.value = data
  }

  function fetchFirstEntry() {
    const data = $storage.getUniversal('myFirstEntry')
    firstEntry.value = data
  }

  function fetchSubjects() {
    const data: any[] | null = $storage.getLocalStorage('mySubjects')
    const _subjets =
      data?.filter((subject) => subject?.schedules?.length > 0) || []
    subjects.value = _subjets
  }

  function fetchCrossings() {
    const data: number | undefined = $storage.getLocalStorage('myCrossings')
    const _crossings = Number(data) || 0
    crossings.value = _crossings
  }

  function fetchSchedules() {
    const data: any[] | undefined = $storage.getLocalStorage('mySchedules')
    const _schedules: ISchedule[] =
      data?.map?.((s) => ({
        ...s,
        events: s.events.map((e: any) =>
          Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e)
        ),
      })) || []
    schedules.value = _schedules
  }

  function fetchFavoritesSchedules() {
    const data: any[] | undefined = $storage.getLocalStorage(
      'myFavoritesSchedules'
    )
    const _schedules: ISchedule[] =
      data?.map?.((s) => ({
        ...s,
        events: s.events.map((e: any) =>
          Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e)
        ),
      })) || []
    favoritesSchedules.value = _schedules
  }

  function updateHourlyLoad(newHourlyLoad: IHourlyLoad) {
    hourlyLoad.value = newHourlyLoad
    const currentHourlyLoad: IHourlyLoad | null | undefined =
      $storage.getUniversal('myHourlyLoad')
    if (currentHourlyLoad) {
      if (currentHourlyLoad.id !== newHourlyLoad.id) {
        isNewHourlyLoad.value = true
      } else if (
        currentHourlyLoad.id === newHourlyLoad.id &&
        currentHourlyLoad.updatedAt !== newHourlyLoad.updatedAt
      ) {
        isUpdateHourlyLoad.value = true
      }
    }
    $storage.setUniversal('myHourlyLoad', newHourlyLoad)
  }

  async function fetchHourlyLoad() {
    if (facultyId.value) {
      try {
        const { data } = await $api.hourlyLoad.getLatestByFaculty(
          facultyId.value
        )
        updateHourlyLoad(data)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return {
    fetchHourlyLoad,
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
    ADD_SUBJECT,
    DELETE_SUBJECT_BY_INDEX,
    UPDATE_SUBJECT_BY_INDEX,
    ADD_SCHEDULE,
    DELETE_SCHEDULE_BY_INDEX,
    UPDATE_SCHEDULE_BY_INDEX,
    ADD_FAVORITE_SCHEDULE,
    DELETE_FAVORITE_SCHEDULE_BY_INDEX,
    UPDATE_FAVORITE_SCHEDULE_BY_INDEX,
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
  }
})
