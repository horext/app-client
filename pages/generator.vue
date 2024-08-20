<template>
  <v-container fluid>
    <v-dialog v-model="firstEntry" max-width="600" persistent>
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
import type { IOrganization } from '~/interfaces/organization'
import { useHourlyLoadApi } from '~/modules/apis/runtime/composables'
import { useUserConfigStore } from '~/stores/user-config'

definePageMeta({
  layout: 'app',
})

useSeoMeta({
  title: 'Generador de Horarios',
  description: 'Genera tu horario de clases de manera sencilla',
})

const store = useUserConfigStore()

const hourlyLoadApi = useHourlyLoadApi()

async function fetchHourlyLoad(faculty: IOrganization) {
  try {
    const data = await hourlyLoadApi.getLatestByFaculty(faculty.id)
    store.updateHourlyLoad(data)
  } catch (e) {
    console.error(e)
  }
}

await useAsyncData('initData', async () => {
  const [_, faculty] = await Promise.all([
    store.fetchFirstEntry(),
    store.fetchFaculty(),
    store.fetchSpeciality(),
  ])
  if (faculty) {
    await fetchHourlyLoad(faculty)
  }

  return true
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
</script>

<style scoped></style>
