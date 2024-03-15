<template>
  <v-container fluid>
    <v-dialog
      v-show="firstEntry"
      v-model="firstEntry"
      max-width="600"
      persistent
    >
      <InitialSettings />
    </v-dialog>
    <v-dialog v-model="isNewHourlyLoad" max-width="600">
      <v-card>
        <v-card-title class="text-h5">Nueva Carga Horaria</v-card-title>
        <v-card-text>
          Se ha encontrado una nueva carga horaria. Actualiza las secciones de
          los cursos que ya tenias guardadas si deseas los nuevos horarios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="isNewHourlyLoad = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isUpdateHourlyLoad" persistent>
      <v-card>
        <v-card-title class="text-h5"
          >Se ha actualizado la Carga Horaria</v-card-title
        >
        <v-card-text>
          Actualiza las secciones de las materias que ya tenias guardadas si
          deseas los nuevos horarios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="isUpdateHourlyLoad = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <NuxtPage />
  </v-container>
</template>

<script lang="ts">
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
  setup() {
    definePageMeta({
      layout: 'app',
    })

    useSeoMeta({
      title: 'Generador de Horarios',
      description: 'Genera tu horario de clases de manera sencilla',
    })

    const configStore = useUserConfigStore()
    const router = useRouter()

    const { firstEntry, isNewHourlyLoad, isUpdateHourlyLoad } =
      storeToRefs(configStore)

    watch(firstEntry, async (newValue, oldValue) => {
      if (oldValue && !newValue) {
        await router.push('/generator/subjects')
      }
    })

    return {
      firstEntry,
      isNewHourlyLoad,
      isUpdateHourlyLoad,
    }
  },
})
</script>

<style scoped></style>
