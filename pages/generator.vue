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
import { useRouter } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { defineComponent, watch, onMounted } from 'vue'
import InitialSettings from '~/components/setting/Initial.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useUserEventsStore } from '~/stores/user-events'

export default defineComponent({
  name: 'Generator',
  components: {
    InitialSettings
  },
  layout: 'app',
  setup () {
    const configStore = useUserConfigStore()
    const eventsStore = useUserEventsStore()
    const router = useRouter()

    const { firstEntry } = storeToRefs(configStore)

    watch(firstEntry, (newValue, oldValue) => {
      if (oldValue && !newValue) {
        router.push('/generator/subjects')
      }
    })

    onMounted(async () => {
      await configStore.fetchSubjects()
      await configStore.fetchSchedules()
      await configStore.fetchCrossings()
      await configStore.fetchFavoritesSchedules()
      await eventsStore.fetchItems()
    })

    return {
      firstEntry
    }
  },
  async asyncData ({ $pinia }: Context) {
    const store = useUserConfigStore($pinia)
    await store.fetchFirstEntry()
    await store.fetchFaculty()
    await store.fetchSpeciality()
    await store.fetchHourlyLoad()
  },
  head: {
    title: 'Generador de Horarios'
  }
})
</script>

<style scoped></style>
