import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { Faculty, Speciality } from '~/types'

@Module({
  name: 'modules/Specialities',
  stateFactory: true,
  namespaced: true
})
export default class Specialities extends VuexModule {
  public faculty!: Faculty;
  public specialities: Speciality[]=[];

  @Mutation
  setSpecialities (specialities: []) {
    this.specialities = specialities
  }

  @Mutation
  setFaculty (faculty: Faculty) {
    this.faculty = faculty
  }

  @Action({ rawError: true })
  async getSpecialities (id:string) {
    console.log(id)
    try {
      const data = await $axios.$get('/especialidades?facultad=' + id)
      this.context.commit('setSpecialities', data.especialidades)
    } catch (e) {
      console.log(e)
    }
  }
}
