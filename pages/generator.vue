<template>
  <div>
    <NuxtChild />
    <v-dialog v-if="firstEntry" v-model="firstEntry" max-width="600" persistent>
      <InitialSettings :dialog.sync="firstEntry" />
    </v-dialog>
    <v-dialog v-model="isNewHourlyLoad" max-width="600">
      <v-card>
        <v-card-title class="headline">Nueva Carga Horaria</v-card-title>
        <v-card-text>
          Se ha encontrado una nueva carga horaria. Actualiza las secciones de
          los cursos que ya tenias guardadas si deseas los nuevos horarios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="isNewHourlyLoad = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isUpdateHourlyLoad" persistent>
      <v-card>
        <v-card-title class="headline"
          >Se ha actualizado la Carga Horaria</v-card-title
        >
        <v-card-text>
          Actualiza las secciones de las materias que ya tenias guardadas si
          deseas los nuevos horarios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="isUpdateHourlyLoad = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useFetch, useRouter } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { defineComponent, watch, onMounted } from 'vue'
import InitialSettings from '~/components/setting/Initial.vue'
import { useUserConfigStore } from '~/stores/user-config'
import { useUserEventsStore } from '~/stores/user-events'

export default defineComponent({
  name: 'Generator',
  components: {
    InitialSettings,
  },
  layout: 'app',
  setup() {
    const configStore = useUserConfigStore()
    const eventsStore = useUserEventsStore()
    const router = useRouter()

    const { firstEntry, isNewHourlyLoad, isUpdateHourlyLoad } =
      storeToRefs(configStore)

    watch(firstEntry, (newValue, oldValue) => {
      if (oldValue && !newValue) {
        router.push('/generator/subjects')
      }
    })
    const { fetch, fetchState } = useFetch(async () => {
      const store = useUserConfigStore()
      await store.fetchFirstEntry()
      await store.fetchFaculty()
      await store.fetchSpeciality()
      await store.fetchHourlyLoad()
    })

    onMounted(async () => {
      await configStore.fetchSubjects()
      await configStore.fetchSchedules()
      await configStore.fetchCrossings()
      await configStore.fetchFavoritesSchedules()
      await eventsStore.fetchItems()
    })

    return {
      firstEntry,
      isNewHourlyLoad,
      isUpdateHourlyLoad,
      fetch,
      fetchState,
    }
  },
  head: {
    title: 'Generador de Horarios',
  },
})
</script>

<style scoped></style>
