import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { User, Speciality, Course, Faculty } from '~/types'

interface UserData {
  first: string
  last: string
  address1: string
  address2: string
  state: string
  country: string
  phone: number
}
@Module({
  name: 'modules/MyData',
  stateFactory: true,
  preserveState: true,
  namespaced: true
})
export default class MyData extends VuexModule {
  public user!: User
  public myFaculty: any = null
  public myHourlyLoad: any = null
  public mySpeciality: any = null
  public myCourses:Course[]=[]
  public myEvents:Array<any>=[]
  public mySchedules:Course[]=[]
  public myFavoritesSchedules:Array<any>=[]
  public firstEntry:boolean=true
  public automaticUpdate:boolean=true
  public weekDays: Array<number> = [1, 2, 3, 4, 5, 6]
  public automaticUpdateAlert:boolean=true
  public firstUse:boolean = true
  public step:number = 1

  @Mutation
  setUser (user: User) {
    this.user = user
  }

  @Mutation
  setFirstUse (firstUse: boolean) {
    this.firstUse = firstUse
  }

  @Mutation
  setStep (step: number) {
    this.step = step
  }

  @Mutation
  setAutomaticUpdate (automaticUpdate:boolean) {
    this.automaticUpdate = automaticUpdate
  }

  @Mutation
  setAutomaticUpdateAlert (automaticUpdateAlert:boolean) {
    this.automaticUpdateAlert = automaticUpdateAlert
  }

  get findIndexMyFavoriteScheduleById (): (id: string) => number {
    return (id: string) => this.myFavoritesSchedules.findIndex(x => x.id === id)
  }

  get findIndexMyScheduleById (): (id: number) => number {
    return (id: number) => this.mySchedules.findIndex(x => x.id === id)
  }

  @Mutation
  setFirstEntry (firstEntry: boolean) {
    this.firstEntry = firstEntry
  }

  get getFirstEntry ():boolean {
    return this.firstEntry
  }

  @Mutation
  setMyCourses (courses:Course[]) {
    this.myCourses = courses
  }

  @Mutation
  addMyCourse (course:Course) {
    this.myCourses.push(course)
  }

  @Mutation
  updateMyCourseByIndex ({ index, course }: any) {
    this.myCourses = this.myCourses.map((c, i) => i === index ? course : c)
  }

  @Mutation
  updateMyEventByIndex ({ index, event }: any) {
    this.myEvents = this.myEvents.map((c, i) => i === index ? event : c)
  }

  @Mutation
  deleteMyCourseByIndex (index: number) {
    this.myCourses.splice(index, 1)
  }

  @Mutation
  deleteMyEventByIndex (index: number) {
    this.myEvents.splice(index, 1)
  }

  @Mutation
  setMyHourlyLoad (myHourlyLoad:any) {
    this.myHourlyLoad = myHourlyLoad
  }

  @Mutation
  addMyEvent (event: Event) {
    this.myEvents.push(event)
  }

  @Mutation
  deleteMyEvent (event: any) {
    this.myEvents = this.myEvents.filter((x:any) =>
      (x.id !== event.id)
    )
  }

  @Mutation
  setMyEvents (events:Array<Event>) {
    this.myEvents = events
  }

  @Mutation
  setMySchedules (mySchedules:Course[]) {
    this.mySchedules = mySchedules
  }

  @Mutation
  setSpeciality (speciality: Speciality) {
    this.mySpeciality = speciality
  }

  @Mutation
  deleteFavoriteSchedule ({ indexFavorite, indexSchedule }:any) {
    this.myFavoritesSchedules.splice(indexFavorite, 1)
    if (indexSchedule >= 0) { this.mySchedules[indexSchedule].isFavorite = false }
  }

  @Mutation
  deleteFavoriteExternalSchedule ({ indexFavorite }:any) {
    this.myFavoritesSchedules.splice(indexFavorite, 1)
  }

  @Mutation
  addFavoriteExternalSchedule ({ schedule }:any) {
    this.myFavoritesSchedules.push(schedule)
  }

  @Mutation
  addFavoriteSchedule ({ schedule, index }:any) {
    this.myFavoritesSchedules.push(schedule)
    this.mySchedules[index].isFavorite = true
  }

  @Mutation
  setMyFavoritesSchedules (schedules: Array<any>) {
    this.myFavoritesSchedules = schedules
  }

  @Mutation
  setMyFaculty (faculty: Faculty) {
    this.myFaculty = faculty
  }
}
