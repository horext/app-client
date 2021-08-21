import { MutationTree } from 'vuex'

export const state = () => ({
  content: '',
  timeout: '',
  color: ''
})

export type SnackbarModule = ReturnType<typeof state>

export const mutations: MutationTree<SnackbarModule> = {
  showMessage (state, payload) {
    state.content = payload.content
    state.timeout = payload.timeout
    state.color = payload.color
  }
}
