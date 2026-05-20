<template>
  <v-container fluid>
    <v-dialog :model-value="!setupCompleted" max-width="600" persistent>
      <InitialForm :loading="loading" @submit="onSubmit" />
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
import { ref, watch } from 'vue'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import InitialForm from '~/components/setting/Initial.vue'

definePageMeta({
  layout: 'app',
})

useSeoMeta({
  title: 'Generador de Horarios',
  description: 'Genera tu horario de clases de manera sencilla',
})

const { setupCompleted, isNewHourlyLoad, isUpdateHourlyLoad, completeSetup } =
  useUserProfile()

const router = useRouter()

const loading = ref(false)

const onSubmit = async (
  facultyId: number,
  specialityId: number,
  hourlyLoad: IHourlyLoad,
) => {
  loading.value = true
  await completeSetup(facultyId, specialityId, hourlyLoad)
  loading.value = false
}

watch(setupCompleted, async (newValue, oldValue) => {
  if (!oldValue && newValue) {
    await router.push('/generator/subjects')
  }
})
</script>

<style scoped></style>
