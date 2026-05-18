<template>
  <v-container fluid>
    <v-dialog :model-value="!setupCompleted" max-width="600" persistent>
      <InitialSettings />
    </v-dialog>
    <base-alert-dialog v-model="isNewHourlyLoad">
      Se ha encontrado una nueva carga horaria. Actualiza las secciones de los
      cursos que ya tenias guardadas si deseas los nuevos horarios.
    </base-alert-dialog>
    <base-alert-dialog v-model="isUpdateHourlyLoad">
      Actualiza las secciones de las cursos que ya tenias guardados si deseas
      los nuevos horarios.
    </base-alert-dialog>
    <NuxtPage />
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import InitialSettings from '~/components/setting/Initial.vue'
import { useUserConfigStore } from '~/stores/user-config'

definePageMeta({
  layout: 'app',
})

useSeoMeta({
  title: 'Generador de Horarios',
  description: 'Genera tu horario de clases de manera sencilla',
})

const configStore = useUserConfigStore()
const router = useRouter()

const { setupCompleted, isNewHourlyLoad, isUpdateHourlyLoad } =
  storeToRefs(configStore)

watch(setupCompleted, async (newValue, oldValue) => {
  if (!oldValue && newValue) {
    await router.push('/generator/subjects')
  }
})
</script>

<style scoped></style>
