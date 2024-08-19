<template>
  <v-card :loading="loadingHourlyLoad">
    <v-card-title> Configuración </v-card-title>
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          :loading="loadingFaculties"
          return-object
          item-title="name"
          label="Facultades"
        />
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Especialidades"
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

const faculties = ref<IOrganization[]>([])
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

const loadingFaculties = ref(false)

const hourlyLoadApi = useHourlyLoadApi()

async function fetchHourlyLoad(faculty: IOrganization) {
  try {
    const data = await hourlyLoadApi.getLatestByFaculty(faculty.id)
    store.updateHourlyLoad(data)
  } catch (e) {
    console.error(e)
  }
}

const init = async () => {
  loadingFaculties.value = true
  const data = await facultyApi.getAll()
  faculties.value = data
  loadingFaculties.value = false
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
