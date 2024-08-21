<template>
  <v-card :loading="loadingHourlyLoad">
    <v-card-title> Configuración Básica </v-card-title>
    <v-card-subtitle>
      Selecciona tu facultad para obtener tu carga horaria y selecciona tu
      especialidad para filtrar los cursos.
    </v-card-subtitle>
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          :loading="loadingFaculties"
          return-object
          item-title="name"
          label="Selecciona tu facultad"
          placeholder="Facultad"
        />
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Selecciona tu especialidad"
          placeholder="Especialidad"
        />
      </v-form>
      <v-alert v-model="showErrorMessage" closable type="error">
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="loading"
        :disabled="!hourlyLoad"
        variant="text"
        @click="ending"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IOrganization } from '~/interfaces/organization'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
} from '~/modules/apis/runtime/composables'

const houlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const store = useUserConfigStore()

const specialities = ref<IOrganization[]>([])
const errorMessage = ref('')
const showErrorMessage = ref(false)
const loading = ref(false)

const faculty = ref<IOrganization>()
const speciality = ref<IOrganization>()
const hourlyLoad = ref<IHourlyLoad>()

const loadingSpecialities = ref(false)
const initSpecialities = async (selectedFaculty: IOrganization) => {
  speciality.value = undefined
  loadingSpecialities.value = true
  const data = await specialityApi.getAllByFaculty(selectedFaculty.id)
  specialities.value = data
  loadingSpecialities.value = false
}

watch(faculty, async (newValue) => {
  if (newValue) {
    await initSpecialities(newValue)
  }
})

const loadingHourlyLoad = ref(false)
const onChangeSpeciality = async (_speciality: IOrganization) => {
  hourlyLoad.value = undefined
  if (!faculty.value) return
  try {
    loadingHourlyLoad.value = true
    const data = await houlyLoadApi.getLatestByFaculty(faculty.value.id)
    hourlyLoad.value = data
  } catch (e) {
    errorMessage.value = 'No se pudo obtener la carga horaria.'
    showErrorMessage.value = true
  } finally {
    loadingHourlyLoad.value = false
  }
}
watch(speciality, async (newValue) => {
  showErrorMessage.value = false
  if (newValue) {
    await onChangeSpeciality(newValue)
  }
})

const hourlyLoadApi = useHourlyLoadApi()

async function fetchHourlyLoad(faculty: IOrganization) {
  try {
    const data = await hourlyLoadApi.getLatestByFaculty(faculty.id)
    store.updateHourlyLoad(data)
  } catch (e) {
    console.error(e)
  }
}

const { data: faculties, pending: loadingFaculties } = useAsyncData<
  IOrganization[]
>(() => facultyApi.getAll(), {
  default: () => [],
})

const init = async () => {
  faculty.value = store.faculty
  hourlyLoad.value = store.hourlyLoad
  speciality.value = store.speciality
}

const ending = async () => {
  loading.value = true
  store.updateFaculty(faculty.value!)
  store.updateSpeciality(speciality.value!)
  await fetchHourlyLoad(faculty.value!)
  store.updateFirstEntry(false)
  loading.value = false
}

onMounted(async () => {
  await init()
})
</script>
