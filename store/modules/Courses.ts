
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Course, Speciality } from '~/types'
import { $axios } from '~/utils/api'

@Module(
  {
    name: 'modules/Courses',
    stateFactory: true,
    namespaced: true
  }
)
export default class Courses extends VuexModule {
  public speciality!: Speciality;
  public courses:Course[]=[];

  @Mutation
  setCourses (courses: []) {
    this.courses = courses
  }

  @Mutation
  setSpeciality (speciality: Speciality) {
    this.speciality = speciality
  }

  @Action({ rawError: true })
  async getCourses (speciality:Speciality) {
    try {
      const data = await $axios.$post('/cursos?by=especialidad', speciality)
      this.context.commit('setCourses', data.cursos)
    } catch (e) {
      console.log(e)
    }
  }
}
