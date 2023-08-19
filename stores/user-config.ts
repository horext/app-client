import { computed, ref } from 'vues'
import { defineStore } from 'pinia'
import { Faculty, Speciality } from '~/types'
import { $storage, $api } from '~/utils/api'
import Event from '~/model/Event'

export const useUserConfigStore = defineStore('user-config', () => {
  const faculty = ref<Faculty>()
  const speciality = ref<Speciality>()
  const hourlyLoad = ref<any>({})
  const subjects = ref<Array<any>>([])
  const events = ref<Array<any>>([])
  const schedules = ref<Array<any>>([])
  const favoritesSchedules = ref<Array<any>>([])
  const weekDays = ref([0, 1, 2, 3, 4, 5, 6])
  const crossings = ref(0)
  const firstEntry = ref(true)

  const facultyId = computed(() => {
    return faculty.value?.id
  })

  const specialityId = computed(() => {
    return speciality.value?.id
  })

  const hourlyLoadId = computed(() => {
    return hourlyLoad?.value.id
  })

  function SET_FACULTY (_faculty: any) {
    faculty.value = _faculty
  }

  function SET_CROSSINGS (_crossings: number) {
    crossings.value = _crossings
  }

  function SET_SPECIALITY (_speciality: any) {
    speciality.value = _speciality
  }

  function SET_SUBJECTS (_subjects: any) {
    subjects.value = _subjects
  }

  function SET_EVENTS (_events: any) {
    events.value = _events
  }

  function SET_SCHEDULES (_schedules: any[]) {
    schedules.value = _schedules
  }

  function SET_FAVORITES_SCHEDULES (_favoritesSchedules: any[]) {
    favoritesSchedules.value = _favoritesSchedules
  }

  function SET_FIRST_ENTRY (_firstEntry: boolean) {
    firstEntry.value = _firstEntry
  }

  function SET_HOURLY_LOAD (_hourlyLoad: any) {
    hourlyLoad.value = _hourlyLoad
  }

  function ADD_SUBJECT (subject: any) {
    subjects.value.push(Object.assign({}, subject))
  }

  function DELETE_SUBJECT_BY_INDEX (index: any) {
    subjects.value.splice(index, 1)
  }

  function UPDATE_SUBJECT_BY_INDEX ({ index, subject }: any) {
    subjects.value = subjects.value.map((c, i) => (i === index ? subject : c))
  }

  function ADD_EVENT (subject: any) {
    events.value.push(Object.assign({}, subject))
  }

  function DELETE_EVENT_BY_INDEX (index: any) {
    events.value.splice(index, 1)
  }

  function UPDATE_EVENT_BY_INDEX ({ index, subject }: any) {
    events.value = events.value.map((c, i) => (i === index ? subject : c))
  }

  function ADD_SCHEDULE (subject: any) {
    schedules.value.push(Object.assign({}, subject))
  }

  function DELETE_SCHEDULE_BY_INDEX (index: any) {
    schedules.value.splice(index, 1)
  }

  function UPDATE_SCHEDULE_BY_INDEX ({ index, subject }: any) {
    schedules.value = schedules.value.map((c, i) =>
      i === index ? subject : c
    )
  }

  function ADD_FAVORITE_SCHEDULE (subject: any) {
    favoritesSchedules.value.push(Object.assign({}, subject))
  }

  function DELETE_FAVORITE_SCHEDULE_BY_INDEX (index: any) {
    favoritesSchedules.value.splice(index, 1)
  }

  function UPDATE_FAVORITE_SCHEDULE_BY_INDEX ({ index, subject }: any) {
    favoritesSchedules.value = favoritesSchedules.value.map((c, i) =>
      i === index ? subject : c
    )
  }

  async function updateFaculty (faculty: any) {
    await $storage.setUniversal('myFaculty', faculty)
    SET_FACULTY(faculty)
  }

  async function updateSpeciality (speciality: any) {
    $storage.setUniversal('mySpeciality', speciality)
    await SET_SPECIALITY(speciality)
    await fetchHourlyLoad()
  }

  async function updateFirstEntry (myFirstEntry: any) {
    await $storage.setUniversal('myFirstEntry', myFirstEntry)
    SET_FIRST_ENTRY(myFirstEntry)
  }

  function updateCrossings (crossings: any) {
    $storage.setUniversal('myCrossings', crossings)
    SET_CROSSINGS(crossings)
  }

  function saveNewSubject (_subject: any) {
    ADD_SUBJECT(_subject)
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function deleteSubjectById (id: any) {
    const index = subjects.value.findIndex(s => s.id === id)
    DELETE_SUBJECT_BY_INDEX(index)
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function updateSubject (_subject: any) {
    const index = subjects.value.findIndex(s => s.id === _subject.id)
    UPDATE_SUBJECT_BY_INDEX({
      index,
      _subject
    })
    $storage.setLocalStorage('mySubjects', subjects.value)
  }

  function updateSchedules (_schedules: any[]) {
    SET_SCHEDULES(_schedules)
    $storage.setLocalStorage('mySchedules', schedules.value)
  }

  function saveNewFavoriteSchedule (_favoritesSchedule: any) {
    ADD_FAVORITE_SCHEDULE(_favoritesSchedule)
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  function deleteFavoriteScheduleById (id: any) {
    const index = subjects.value.findIndex(s => s.id === id)
    DELETE_FAVORITE_SCHEDULE_BY_INDEX(index)
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  function updateFavoritesSchedules (_favoritesSchedules: any[]) {
    SET_FAVORITES_SCHEDULES(_favoritesSchedules)
    $storage.setLocalStorage('myFavoritesSchedules', favoritesSchedules.value)
  }

  function updateEvents (_events: any[]) {
    SET_SCHEDULES(_events)
    $storage.setLocalStorage('myEvents', events.value)
  }

  function fetchFaculty () {
    SET_FACULTY($storage.getUniversal('myFaculty'))
  }

  function fetchSpeciality () {
    SET_SPECIALITY($storage.getUniversal('mySpeciality'))
  }

  function fetchFirstEntry () {
    SET_FIRST_ENTRY($storage.getUniversal('myFirstEntry'))
  }

  function fetchSubjects () {
    SET_SUBJECTS($storage.getLocalStorage('mySubjects') || [])
  }

  function fetchCrossings () {
    const data: number | undefined = $storage.getLocalStorage('myCrossings')
    SET_CROSSINGS(Number(data) || 0)
  }

  function fetchEvents () {
    SET_EVENTS($storage.getLocalStorage('myEvents') || [])
  }

  function fetchSchedules () {
    const data: any[] | undefined = $storage.getLocalStorage('mySchedules')
    const schedules =
      data?.map?.((s: { events: any[] }) => ({
        ...s,
        events: s.events.map((e: any) =>
          Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e)
        )
      })) || []
    SET_SCHEDULES(schedules)
  }

  function fetchFavoritesSchedules () {
    const data: any[] | undefined = $storage.getLocalStorage(
      'myFavoritesSchedules'
    )
    const schedules =
      data?.map?.((s: { events: any[] }) => ({
        ...s,
        events: s.events.map((e: any) =>
          Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e)
        )
      })) || []
    SET_FAVORITES_SCHEDULES(schedules)
  }

  async function fetchHourlyLoad () {
    if (facultyId.value) {
      try {
        const { data } = await $api.hourlyLoad.getLatestByFaculty(
          facultyId.value
        )

        SET_HOURLY_LOAD(data)
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
    events,
    schedules,
    favoritesSchedules,
    weekDays,
    firstEntry,
    facultyId,
    specialityId,
    hourlyLoadId,
    SET_FACULTY,
    SET_CROSSINGS,
    SET_SPECIALITY,
    SET_SUBJECTS,
    SET_EVENTS,
    SET_SCHEDULES,
    SET_FAVORITES_SCHEDULES,
    SET_FIRST_ENTRY,
    SET_HOURLY_LOAD,
    ADD_SUBJECT,
    DELETE_SUBJECT_BY_INDEX,
    UPDATE_SUBJECT_BY_INDEX,
    ADD_EVENT,
    DELETE_EVENT_BY_INDEX,
    UPDATE_EVENT_BY_INDEX,
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
    saveNewSubject,
    deleteSubjectById,
    updateSubject,
    updateSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    updateFavoritesSchedules,
    updateEvents,
    fetchFaculty,
    fetchSpeciality,
    fetchFirstEntry,
    fetchSubjects,
    fetchCrossings,
    fetchEvents,
    fetchSchedules,
    fetchFavoritesSchedules
  }
})
