<template>
  <v-form ref="form" @submit.prevent="ending">
    <v-card :loading="loadingHourlyLoad">
      <v-card-title> Configuración Básica </v-card-title>
      <v-card-subtitle>
        Selecciona tu facultad para obtener tu carga horaria y selecciona tu
        especialidad para filtrar los cursos.
      </v-card-subtitle>
      <v-card-text>
        <v-autocomplete
          v-model="faculty"
          :items="faculties"
          :loading="loadingFaculties"
          return-object
          item-title="name"
          label="Selecciona tu facultad"
          placeholder="Facultad"
          :rules="[(v) => !!v || 'Facultad es requerida']"
        />
        <v-alert v-if="errorMessage" closable type="error">
          No se ha encontrado la carga horaria de tu facultad
        </v-alert>
        <v-autocomplete
          v-model="speciality"
          :disabled="!faculty"
          return-object
          :loading="loadingSpecialities"
          item-title="name"
          :items="specialities"
          label="Selecciona tu especialidad"
          placeholder="Especialidad"
          :rules="[(v) => !!v || 'Especialidad es requerida']"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          :disabled="!hourlyLoad"
          variant="text"
          @click="ending"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserConfigStore } from '~/stores/user-config'
import type { IOrganization } from '~/interfaces/organization'
import {
  useFacultyApi,
  useHourlyLoadApi,
  useSpecialityApi,
} from '~/modules/apis/runtime/composables'
import type { VForm } from 'vuetify/components/VForm'

const houlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const store = useUserConfigStore()

const loading = ref(false)

const faculty = ref<IOrganization>()
const speciality = ref<IOrganization>()

const { pending: loadingSpecialities, data: specialities } = useAsyncData(
  async () => {
    if (!faculty.value) {
      return []
    }
    speciality.value = undefined
    return await specialityApi.getAllByFaculty(faculty.value.id)
  },
  {
    default: () => [],
    watch: [faculty],
  },
)

const {
  pending: loadingHourlyLoad,
  data: hourlyLoad,
  error: errorMessage,
} = useAsyncData(
  async () => {
    if (!faculty.value) {
      return undefined
    }
    const data = await houlyLoadApi.getLatestByFaculty(faculty.value.id)
    return data
  },
  {
    watch: [faculty],
  },
)

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

const form = ref<VForm>()
const ending = async () => {
  const formValue = await form.value?.validate()
  if (!formValue?.valid) {
    return
  }
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
