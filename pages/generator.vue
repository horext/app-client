<template>
  <div>
    <NuxtChild />
    <v-dialog v-if="firstEntry" v-model="firstEntry" max-width="600" persistent>
      <InitialSettings :dialog.sync="firstEntry" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { useRouter, useStore } from '@nuxtjs/composition-api'
import { defineComponent, ref, watch, onMounted } from 'vue'
import InitialSettings from '~/components/setting/Initial.vue'

export default defineComponent({
  name: 'Generator',
  components: {
    InitialSettings
  },
  layout: 'app',
  setup () {
    const store = useStore<any>()
    const router = useRouter()

    const firstEntry = ref(false)

    watch(
      () => store.state.user.config.firstEntry,
      (newValue, oldValue) => {
        if (oldValue && !newValue) {
          router.push('/generator/subjects')
        }
      }
    )

    onMounted(async () => {
      await store.dispatch('user/config/fetchSubjects')
      await store.dispatch('user/config/fetchSchedules')
      await store.dispatch('user/config/fetchCrossings')
      await store.dispatch('user/config/fetchFavoritesSchedules')
      await store.dispatch('user/events/fetchItems')

      firstEntry.value = store.state.user.config.firstEntry
    })

    return {
      firstEntry
    }
  },
  async asyncData ({ store }: Context) {
    await store.dispatch('user/config/fetchFirstEntry')
    await store.dispatch('user/config/fetchFaculty')
    await store.dispatch('user/config/fetchSpeciality')
    await store.dispatch('user/config/fetchHourlyLoad')
  },
  head: {
    title: 'Generador de Horarios'
  }
})
</script>

<style scoped></style>
