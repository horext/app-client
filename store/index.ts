
import VuexPersistence from 'vuex-persist'
import { RootState } from '~/types'
function getPlugins () {
  const plugins = []

  if (process.browser) {
    const vuexLocal = new VuexPersistence<RootState>({
      storage: window.localStorage,
      modules: ['UserModule']
    })

    plugins.push(vuexLocal.plugin)
  }
}

export const plugins = getPlugins()
