import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { Faculty } from '~/types'

@Module({
  name: 'modules/Faculties',
  stateFactory: true,
  namespaced: true
})
export default class Faculties extends VuexModule {
  public faculties: Faculty[]=[];

  @Mutation
  setFaculties (faculties: []) {
    this.faculties = faculties
  }

  @Action({ rawError: true })
  async getFaculties () {
    try {
      const data = await $axios.$get('/facultades')
      this.context.commit('setSpecialities', data.facultades)
    } catch (e) {
      console.log(e)
    }
  }
}
