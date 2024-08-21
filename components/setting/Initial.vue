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
          v-model="internalFaculty"
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
          v-model="internalSpeciality"
          :disabled="!internalFaculty"
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

const hourlyLoadApi = useHourlyLoadApi()
const facultyApi = useFacultyApi()
const specialityApi = useSpecialityApi()
const store = useUserConfigStore()

const loading = ref(false)

const internalFaculty = ref<IOrganization>()
const internalSpeciality = ref<IOrganization>()

const { pending: loadingSpecialities, data: specialities } = useAsyncData(
  async () => {
    if (!internalFaculty.value) {
      return []
    }
    internalSpeciality.value = undefined
    return await specialityApi.getAllByFaculty(internalFaculty.value.id)
  },
  {
    default: () => [],
    watch: [internalFaculty],
  },
)

const {
  pending: loadingHourlyLoad,
  data: hourlyLoad,
  error: errorMessage,
} = useAsyncData(
  async () => {
    if (!internalFaculty.value) {
      return undefined
    }
    const data = await hourlyLoadApi.getLatestByFaculty(
      internalFaculty.value.id,
    )
    return data
  },
  {
    watch: [internalFaculty],
  },
)

const { data: faculties, pending: loadingFaculties } = useAsyncData<
  IOrganization[]
>(() => facultyApi.getAll(), {
  default: () => [],
})

const init = async () => {
  internalFaculty.value = store.faculty
  hourlyLoad.value = store.hourlyLoad
  internalSpeciality.value = store.speciality
}

const form = ref<VForm>()
const ending = async () => {
  const formValue = await form.value?.validate()
  if (!formValue?.valid) {
    return
  }
  loading.value = true
  store.updateFaculty(internalFaculty.value!)
  store.updateSpeciality(internalSpeciality.value!)
  await store.updateHourlyLoad(hourlyLoad.value!)
  store.updateFirstEntry(false)
  loading.value = false
}

onMounted(async () => {
  await init()
})
</script>
