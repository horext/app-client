import { Module, VuexAction, VuexModule, VuexMutation } from 'nuxt-property-decorator'
import { Faculty, Speciality } from '~/types'
import { $api, $storage } from '~/utils/api'
import Event from '~/model/Event'

@Module({
  namespaced: true
})
export default class Config extends VuexModule {
  public faculty: Faculty|any = {}
  public speciality: Speciality|any = { }
  public hourlyLoad: any = {}
  public subjects: Array<any> = []
  public events: Array<any> = []
  public schedules: Array<any>= []
  public favoritesSchedules: Array<any>= []
  public firstEntry: boolean = true

  public get facultyId () {
    return this.faculty?.id
  }

  public get specialityId () {
    return this.speciality?.id
  }

  public get hourlyLoadId () {
    return this.hourlyLoad?.id
  }

  @VuexMutation
  public SET_FACULTY (faculty:any) {
    this.faculty = faculty
  }

  @VuexMutation
  public SET_SPECIALITY (speciality:any) {
    this.speciality = speciality
  }

  @VuexMutation
  public SET_SUBJECTS (subjects:any) {
    this.subjects = subjects
  }

  @VuexMutation
  public SET_EVENTS (events:any) {
    this.events = events
  }

  @VuexMutation
  public SET_SCHEDULES (schedules:any) {
    this.schedules = schedules
  }

  @VuexMutation
  public SET_FAVORITES_SCHEDULES (favoritesSchedules:any) {
    this.favoritesSchedules = favoritesSchedules
  }

  @VuexMutation
  public SET_FIRST_ENTRY (firstEntry:any) {
    this.firstEntry = firstEntry
  }

  @VuexMutation
  public SET_HOURLY_LOAD (hourlyLoad:any) {
    this.hourlyLoad = hourlyLoad
  }

  @VuexMutation
  public ADD_SUBJECT (subject:any) {
    this.subjects.push(Object.assign({}, subject))
  }

  @VuexMutation
  public DELETE_SUBJECT_BY_INDEX (index: any) {
    this.subjects.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_SUBJECT_BY_INDEX ({ index, subject }: any) {
    this.subjects = this.subjects.map((c, i) => i === index ? subject : c)
  }

  @VuexMutation
  public ADD_EVENT (subject:any) {
    this.events.push(Object.assign({}, subject))
  }

  @VuexMutation
  public DELETE_EVENT_BY_INDEX (index: any) {
    this.events.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_EVENT_BY_INDEX ({ index, subject }: any) {
    this.events = this.events.map((c, i) => i === index ? subject : c)
  }

  @VuexMutation
  public ADD_SCHEDULE (subject:any) {
    this.schedules.push(Object.assign({}, subject))
  }

  @VuexMutation
  public DELETE_SCHEDULE_BY_INDEX (index: any) {
    this.schedules.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_SCHEDULE_BY_INDEX ({ index, subject }: any) {
    this.schedules = this.schedules.map((c, i) => i === index ? subject : c)
  }

  @VuexMutation
  public ADD_FAVORITE_SCHEDULE (subject:any) {
    this.favoritesSchedules.push(Object.assign({}, subject))
  }

  @VuexMutation
  public DELETE_FAVORITE_SCHEDULE_BY_INDEX (index: any) {
    this.favoritesSchedules.splice(index, 1)
  }

  @VuexMutation
  public UPDATE_FAVORITE_SCHEDULE_BY_INDEX ({ index, subject }: any) {
    this.favoritesSchedules = this.favoritesSchedules.map((c, i) => i === index ? subject : c)
  }

  @VuexAction({ commit: 'SET_FACULTY' })
  public updateFaculty (faculty: any) {
    $storage.setUniversal('myFaculty', faculty)
    return faculty
  }

  @VuexAction({ commit: 'SET_SPECIALITY' })
  public updateSpeciality (faculty: any) {
    $storage.setUniversal('mySpeciality', faculty)
    return faculty
  }

  @VuexAction({ commit: 'SET_FIRST_ENTRY' })
  public updateFirstEntry (faculty: any) {
    $storage.setUniversal('myFirstEntry', faculty)
    return faculty
  }

  @VuexAction
  public saveNewSubject (subject: any) {
    this.context.commit('ADD_SUBJECT', subject)
    $storage.setLocalStorage('mySubjects', this.subjects)
  }

  @VuexAction
  public deleteSubjectById (id: any) {
    const index = this.subjects.findIndex(s => s.id === id)
    this.context.commit('DELETE_SUBJECT_BY_INDEX', index)
    $storage.setLocalStorage('mySubjects', this.subjects)
  }

  @VuexAction
  public updateSubject (subject: any) {
    const index = this.subjects.findIndex(s => s.id === subject.id)
    this.context.commit(
      'UPDATE_SUBJECT_BY_INDEX',
      {
        index, subject
      })
    $storage.setLocalStorage('mySubjects', this.subjects)
  }

  @VuexAction
  public updateSchedules (mySchedules: any) {
    this.context.commit('SET_SCHEDULES', mySchedules)
    $storage.setLocalStorage('mySchedules', this.schedules)
  }

  @VuexAction
  public updateFavoritesSchedules (mySchedules: any) {
    this.context.commit('SET_FAVORITES_SCHEDULES', mySchedules)
    $storage.setLocalStorage('myFavoritesSchedules', this.favoritesSchedules)
  }

  @VuexAction
  public updateEvents (events: any) {
    this.context.commit('SET_SCHEDULES', events)
    $storage.setLocalStorage('myEvents', this.events)
  }

  @VuexAction({ commit: 'SET_FACULTY' })
  public fetchFaculty () {
    return $storage.getUniversal('myFaculty')
  }

  @VuexAction({ commit: 'SET_SPECIALITY' })
  public fetchSpeciality () {
    return $storage.getUniversal('mySpeciality')
  }

  @VuexAction({ commit: 'SET_FIRST_ENTRY' })
  public fetchFirstEntry () {
    return $storage.getUniversal('myFirstEntry')
  }

  @VuexAction({ commit: 'SET_SUBJECTS' })
  public fetchSubjects () {
    return $storage.getLocalStorage('mySubjects') || []
  }

  @VuexAction({ commit: 'SET_EVENTS' })
  public fetchEvents () {
    return $storage.getLocalStorage('myEvents') || []
  }

  @VuexAction({ commit: 'SET_SCHEDULES' })
  public fetchSchedules () {
    const schedules = $storage.getLocalStorage('mySchedules') || []
    return schedules.map((s: { events: any[] }) => ({
      ...s,
      events: s.events.map((e: any) => Object.assign(
        new Event(0, '', '', '', '', '', '', '', ''),
        e))
    }))
  }

  @VuexAction({ commit: 'SET_FAVORITES_SCHEDULES' })
  public fetchFavoritesSchedules () {
    const schedules = $storage.getLocalStorage('myFavoritesSchedules') || []
    return schedules.map((s: { events: any[] }) => ({
      ...s,
      events: s.events.map((e: any) => Object.assign(
        new Event(0, '', '', '', '', '', '', '', ''),
        e))
    }))
  }

  @VuexAction({ commit: 'SET_HOURLY_LOAD' })
  async fetchHourlyLoad () {
    if (this.facultyId) {
      try {
        const { data } = await $api.hourlyLoad.getLatestByFaculty(this.facultyId)
        return data
      } catch (e) {
        console.error(e)
      }
    }
  }
}
